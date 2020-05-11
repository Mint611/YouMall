//获取请求总次数
let ajaxTimes = 0;
export const request = (params) => {
  let header = { ...params.header };
  if (params.url.includes("/my/")) {
    // 拼接header 带上token
    header["Authorization"] = wx.getStorageSync("token");
  }
  ajaxTimes++;
  //全局添加加载窗口
  wx.showLoading({
    title: "loading",
    mask: true,
  });

  const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      url: baseUrl + params.url,
      success: (result) => {
        resolve(result.data.message);
      },
      fail: (err) => {
        reject(err);
      },
      complete: () => {
        ajaxTimes--;

        if (ajaxTimes === 0) {
          //关闭加载窗口
          wx.hideLoading();
        }
      },
    });
  });
};
