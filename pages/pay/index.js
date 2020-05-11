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
    totalPrice: 0,
    totalNum: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onShow() {
    const address = wx.getStorageSync("address");

    let cart = wx.getStorageSync("cart") || [];

    cart = cart.filter((v) => v.checked);

    this.setData({ address });

    let totalPrice = 0;
    let totalNum = 0;

    cart.forEach((v) => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    });

    this.setData({
      cart,
      totalPrice,
      totalNum,
      address,
    });
  },

  handlePay() {
    showToast({ title: "支付成功" });

    let newCart = wx.getStorageSync("cart");

    newCart = newCart.filter((v) => !v.checked);

    wx.setStorageSync("cart", newCart);

    wx.navigateTo({
      url: "/pages/order/index",
    });
  },
});
