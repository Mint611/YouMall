import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast,
} from "../../utils/asyncWx";
import regeneratorRuntime from "../../lib/runtime/runtime";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  onShow() {
    const address = wx.getStorageSync("address");

    const cart = wx.getStorageSync("cart") || [];

    this.setData({ address });
    this.setCart(cart);
  },

  async handleChooseAddress() {
    try {
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      if (scopeAddress === false) {
        await openSetting();
      }
      const address = await chooseAddress();

      wx.setStorageSync("address", address);
    } catch (error) {
      console.log(error);
    }
  },

  handleItemChange(e) {
    const goods_id = e.currentTarget.dataset.id;

    let { cart } = this.data;

    let index = cart.findIndex((v) => v.goods_id === goods_id);

    cart[index].checked = !cart[index].checked;

    this.setCart(cart);
  },

  //设置购物车状态,刷新数据
  setCart(cart) {
    let allChecked = true;
    let totalPrice = 0;
    let totalNum = 0;

    cart.forEach((v) => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    });

    allChecked = cart.length != 0 ? allChecked : false;

    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum,
    });

    wx.setStorageSync("cart", cart);
  },

  handleAllChecked() {
    let { cart, allChecked } = this.data;

    allChecked = !allChecked;

    cart.forEach((v) => (v.checked = allChecked));

    this.setCart(cart);
  },

  async handleEditNum(e) {
    const { id, operation } = e.currentTarget.dataset;

    let { cart } = this.data;

    const index = cart.findIndex((v) => v.goods_id === id);

    if (cart[index].num === 1 && operation === -1) {
      const res = await showModal({ content: "是否移出购物车?" });

      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      cart[index].num += operation;

      this.setCart(cart);
    }
  },

  async handlePay() {
    const { address, totalNum } = this.data;
    if (!address.userName) {
      await showToast({ title: "请添加收货地址" });
      return;
    }
    if (totalNum === 0) {
      await showToast({ title: "您还没有选择商品" });
      return;
    }

    wx.navigateTo({
      url: "/pages/pay/index",
    });
  },
});
