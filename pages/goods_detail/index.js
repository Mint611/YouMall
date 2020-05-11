import { request } from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
  },

  GoodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { goods_id } = options;

    this.getGoodsDetail(goods_id);
  },

  async getGoodsDetail(goods_id) {
    const goodsObj = await request({
      url: "/goods/detail",
      data: { goods_id },
    });
    this.GoodsInfo = goodsObj;
    this.setData({
      goodsObj: {
        goods_price: goodsObj.goods_price,
        goods_name: goodsObj.goods_name,
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, ".jpg"),
        pics: goodsObj.pics,
      },
    });
  },

  handlePreviewImg(e) {
    const urls = this.GoodsInfo.pics.map((v) => v.pics_mid);
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls,
    });
  },

  handleAddCart(e) {
    let cart = wx.getStorageSync("cart") || [];

    let index = cart.findIndex((v) => v.goods_id === this.GoodsInfo.goods_id);

    if (index === -1) {
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    } else {
      cart[index].num++;
    }

    wx.setStorageSync("cart", cart);

    wx.showToast({
      title: "添加成功",
      icon: "success",
      mask: true,
    });
  },
});
