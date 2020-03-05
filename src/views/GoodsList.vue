<template>
  <div>
    <NavHeader></NavHeader>
    <NavBread>
      <span>Goods</span>
    </NavBread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a
            @click="sortGoods"
            class="price"
            href="javascript:void(0)"
            v-bind:class="{'sort-up':!soortFlag}"
          >
            Price
            <!-- <svg class="icon icon-arrow-short">
              <use xlink:href="#icon-arrow-short"></use>
            </svg>-->
            <img class="icon icon-arrow-short" src="../assets/上箭头.svg" alt />
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd>
                <a
                  href="javascript:void(0)"
                  v-bind:class="{'cur':priceChecked=='all'}"
                  @click="priceChecked='all'"
                >All</a>
              </dd>
              <dd v-for="(item,index) in priceFilter" :key="index">
                <a
                  href="javascript:void(0)"
                  @click="setPriceFilter(index)"
                  v-bind:class="{'cur':priceChecked==index}"
                >{{item.startPrice}} - {{item.endPrice}}</a>
              </dd>
            </dl>
          </div>
          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li class="item" v-for="(item,index) in goodsList" :key="index">
                  <div class="pic">
                    <a href="#">
                      <img v-lazy="'/static/img/'+item.productImage" alt />
                    </a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">￥{{item.salePrice}}元</div>
                    <div class="btn-area">
                      <a
                        href="javascript:;"
                        class="btn btn--m"
                        @click="addCart(item.productId)"
                      >加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div
                class="load-more"
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="busy"
                infinite-scroll-distance="30"
              >
                <img src="/static/loading/loading-spinning-bubbles.svg" v-show="loading" alt />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
   
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    
    <Modal :mdShow="mdShow"  @close="closeModal">
      <p slot="message">
        请先登录 否则无法加入到购物车
      </p>
      <div slot="btnGroup">
        <a class="btn btn-m" id="btn_off"  @click="mdShow = false">关闭</a>

      </div>
    </Modal>


      <Modal :mdShow="mdShowCart"  @close="closeModal">
      <p slot="message">
          <svg class="icon-status-ok">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok" />
        </svg>
         <span>加入购物车成功</span>
      </p>
     <div class="btn_main" slot="btnGroup">
        <a class="btn btn--m" id="btn_off" @click="mdShowCart = false" href="javascript:;">继续购物</a>
        <router-link id="btn_cart" class="btn btn--m btn--red" href="javascript:;" to="/cart">查看购物车</router-link>
      </div>
    </Modal>
    
    <NavFooter></NavFooter>
  </div>
</template>
<script>
import "./../assets/css/base.css";
import "./../assets/css/product.css";
import "./../assets/css/checkout.css";
import NavHeader from "@/components/Header.vue";
import NavFooter from "@/components/Footer.vue";
import NavBread from "@/components/Bread.vue";
import Modal from "@/components/Modal";
import axios from "axios";
export default {
  data() {
    return {
      priceFilter: [
        {
          startPrice: "0.00",
          endPrice: "500.00"
        },
        {
          startPrice: "500.00",
          endPrice: "1000.00"
        },
        {
          startPrice: "1000.00",
          endPrice: "2000.00"
        },
        {
          startPrice: "2000.00",
          endPrice: "5000.00"
        }
      ],
      goodsList: [],
      priceChecked: "all",
      filterBy: false,
      overLayFlag: false,
      sortFlag: true,
      page: 1,
      pageSize: 8,
      busy: true,
      loading: false,
      soortFlag: true,
      mdShow:false,
      mdShowCart:false
      
    };
  },
  mounted() {
    this.getGoodsList();
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread,
    Modal
  },
  methods: {
    showFilterPop() {
      this.filterBy = true;
      this.overLayFlag = true;
    },
    setPriceFilter(index) {
      this.closePop();
      this.priceChecked = index;
      this.page = 1;
      this.getGoodsList();
    },
    closePop() {
      this.filterBy = false;
      this.overLayFlag = false;
    },
    getGoodsList(flag) {
      let param = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1,
        priceLevel: this.priceChecked
      };
      this.loading = true;
      axios.get("/goods/list", { params: param }).then(res => {
        let msg = res.data;
        console.log(res);
        this.loading = false;
        if (msg.atatus == "0") {
          if (flag) {
            this.goodsList = this.goodsList.concat(msg.result.list);
            if (msg.result.count == 0) {
              this.busy = true;
            } else {
              this.busy = false;
            }
          } else {
            this.goodsList = msg.result.list;
            this.busy = false;
          }
        } else {
          this.goodsList = [];
        }
      });
    },
    sortGoods() {
      this.sortFlag = !this.sortFlag;
      this.page = 1;
      this.getGoodsList();
    },
    loadMore() {
      this.busy = true;
      setTimeout(() => {
        this.page++;
        this.getGoodsList(true);
      }, 500);
    },

    addCart(productId) {
      axios
        .post("/goods/addCart", {
          productId: productId
        })
        .then(res => {
          window.console.log(res);
          if (res.data.status == 0) {
            // alert("成功");
            this.mdShowCart = true;
            // this.$store.commit("updateCartCount",1)
          } else {
            // alert(res.data.msg);
            this.mdShow = true;
          }
        });
    },
closeModal(){
 this.mdShow = false;

}
    
  }
};
</script>
<style>
.load-more {
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.sort-up {
  transform: rotate(180deg);
  transition: all 0.3s ease-out;
}
.btn:hover{
  background-color: #ffe5e6;
 transition: all 0.3s ease-out;
}

.btn_main {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
#btn_off {
  width: 160px;
}
#btn_cart {
  width: 160px;
}
</style>
