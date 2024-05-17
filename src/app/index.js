import React, { Component } from "react";
import "./index.scss";

const pullDownClassName = ".refreshWrap";
export default class Index extends Component {
  state = {
    pullDownHeight: 0,
    loading: false,
  };

  componentDidMount() {
    this.bindPullDown();
  }

  componentWillUnmount() {
    this.removePullDown();
  }

  // 绑定下拉刷新
  bindPullDown() {
    const pulldownElement = document.querySelector(pullDownClassName);
    pulldownElement.addEventListener("touchstart", this.bindTouchstart);
    pulldownElement.addEventListener("touchmove", this.bindTouchMove);
    pulldownElement.addEventListener("touchend", this.bindTouched);
  }

  calcDeltaY = () => Math.abs(this.endTouch.pageY - this.startTouch.pageY);

  // 判断是否纵向滚动
  isVerticalSliding = () => {
    const deltaY = this.calcDeltaY();
    const deltaX = Math.abs(this.endTouch.pageX - this.startTouch.pageX);
    if (deltaY > deltaX && deltaY > 50) return true;
  };

  // 判断下拉的距离
  getPullDownHeight = () => {
    const deltaY = this.calcDeltaY();
    return Math.min(deltaY, 100);
  };

  // 是否在首屏
  isInOneScreenPull() {
    const pulldownElement = document.querySelector(pullDownClassName);
    return pulldownElement.scrollTop <= 0;
  }

  bindTouchstart = (event) => {
    this.startTouch = event.touches[0];
  };

  bindTouchMove = (event) => {
    const { loading } = this.state;
    this.endTouch = event.touches[0];
    if (!loading && this.isInOneScreenPull() && this.isVerticalSliding()) {
      const pullDownHeight = this.getPullDownHeight();
      this.setState({
        pullDownHeight,
      });
    }
  };

  bindTouched = (e) => {
    const { loading, pullDownHeight } = this.state;

    // 首屏、非加载状态、纵向滚动有高度时
    if (!loading && pullDownHeight) {
      this.setState({
        pullDownHeight: 0,
      });

      this.getData();

      // 重置触摸Y轴坐标点
      this.startTouch = {};
      this.endTouch = {};
    }
  };

  removePullDown() {
    const pulldownElement = document.querySelector(pullDownClassName);
    pulldownElement.removeEventListener("touchstart", this.bindTouchstart);
    pulldownElement.removeEventListener("touchmove", this.bindTouchMove);
    pulldownElement.removeEventListener("touchend", this.bindTouched);
  }

  // 模拟获取数据
  getData() {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false });
    }, 2000);
  }

  render() {
    const { pullDownHeight, loading } = this.state;
    return (
      <div className="contentWrap">
        <div className="homeHeader">头部区域区域，下拉刷新时保留</div>
        <div className="refreshWrap">
          {/* 下拉时文字提示 */}
          <div className={`pullDownContent`} style={{ height: pullDownHeight }}>
            {loading ? "" : "释放刷新"}
          </div>

          {/* 加载时动画 */}
          <div className={`loadingFlex ${loading ? "" : "loadingHidden"}`}>
            <div className="flexCenter">
              <div className="loadingRing" />
              <div className="loadingText">
                {loading ? "数据更新中..." : "更新成功"}
              </div>
            </div>
          </div>
          <div className="middleArea">刷新区域下方内容区域</div>
        </div>
      </div>
    );
  }
}
