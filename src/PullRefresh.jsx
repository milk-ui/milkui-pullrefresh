/**
 * PullRefresh of milkui-component
 * @author caiyongmin
 *
 * Copyright 2017-2019, All rights reserved.
 */


import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

import { getScrollEventTarget, getScrollTop } from './utils';

import './index.scss';

class PullRefresh extends Component {
  static propTypes = {
    className: PropTypes.string,
    topPullText: PropTypes.string,
    topDropText: PropTypes.string,
    topLoadingText: PropTypes.string,
    topLoad: PropTypes.bool,
    topLoadDistance: PropTypes.number,
    distanceIndex: PropTypes.number,
    onTopLoad: PropTypes.func,
    children: PropTypes.func,
  }
  static defaultProps = {
    className: '',
    topPullText: '↓ 下拉',
    topDropText: '↑ 释放',
    topLoadingText: 'loading...',
    topLoad: false,
    topLoadDistance: 70,
    distanceIndex: 2,
    onTopLoad: null,
  }
  constructor(props) {
    super(props);
    this.contentEle = null;
    this.scrollEventTarget = null;
    this.topDropped = false;
    this.direction = '';
    this.startY = 0;
    this.clientY = 0;
    this.startScrollTop = 0;
    this.state = {
      translate: 0,
      topStatus: 'pull',
      topText: this.props.topPullText,
    };
    this.events = {
      onContentTouchStart: this.onContentTouchStart.bind(this),
      onContentTouchMove: this.onContentTouchMove.bind(this),
      onContentTouchEnd: this.onContentTouchEnd.bind(this),
    };
  }

  componentDidMount() {
    this.scrollEventTarget = getScrollEventTarget(this.contentEle);
    this.dpr = window.devicePixelRatio || 1;
  }

  render() {
    const { translate } = this.state;
    const { className, children } = this.props;
    const wrapCls = classnames('milkui-pullrefresh', className);

    return (
      <div className={wrapCls}>
        {this.renderTopLoader()}
        <div
          ref={(r) => { this.contentEle = r; }}
          className="milkui-pullrefresh__content"
          style={{ transform: `translate3d(0, ${this.getComputedHeight(translate)}px, 0)` }}
          onTouchStart={this.events.onContentTouchStart}
          onTouchMove={this.events.onContentTouchMove}
          onTouchEnd={this.events.onContentTouchEnd}
        >{children}</div>
      </div>
    );
  }

  renderTopLoader() {
    const { topText, translate } = this.state;
    const height = this.getComputedHeight(translate);
    return (
      <div className="milkui-pullrefresh__top" style={{ height: `${height}px` }}>
        <span className="milkui-pullrefresh__loader__text">{topText}</span>
      </div>
    );
  }

  getComputedHeight(height) {
    return height * this.dpr;
  }

  onContentTouchStart(e) {
    console.info('=== onContentTouchStart ===');
    const { topStatus } = this.state;
    const { topPullText } = this.props;
    this.startY = e.touches[0].clientY;
    this.startScrollTop = getScrollTop(this.scrollEventTarget);
    if (
      topStatus !== 'loading' &&
      this.startScrollTop === 0
    ) {
      this.topDropped = false;
      this.setState({
        topStatus: 'pull',
        topText: topPullText,
      });
    }
  }

  onContentTouchMove(e) {
    console.info('=== onContentTouchMove ===');
    if (
      this.startY < this.contentEle.getBoundingClientRect().top &&
      this.startY > this.contentEle.getBoundingClientRect().bottom
    ) {
      return;
    }
    console.info('=== this.startY ===', this.startY);
    console.info('=== this.contentEle.top ===', this.contentEle.getBoundingClientRect().top);
    console.info('=== this.contentEle.bottom ===', this.contentEle.getBoundingClientRect().bottom);
    console.info('=== onContentTouchMove not return ===');

    const { topStatus } = this.state;
    const {
      distanceIndex, topLoad, onTopLoad, topLoadDistance, topDropText, topPullText,
    } = this.props;
    this.currentY = e.touches[0].clientY;
    const distance = (this.currentY - this.startY) / distanceIndex;
    this.direction = distance > 0 ? 'down' : 'up';
    console.info('=== this.currentY ===', this.currentY);
    console.info('=== getScrollTop(this.scrollEventTarget) ===', getScrollTop(this.scrollEventTarget));
    if (
      topLoad &&
      typeof onTopLoad === 'function' &&
      getScrollTop(this.scrollEventTarget) === 0 &&
      this.direction === 'down' &&
      topStatus !== 'loading'
    ) {
      console.info('=== onContentTouchMove pullrefresh ===');
      e.preventDefault();
      e.stopPropagation();
      let translate = distance - this.startScrollTop;
      if (translate < 0) {
        translate = 0;
      }
      this.setState({
        translate,
        topStatus: translate >= topLoadDistance ? 'drop' : 'pull',
        topText: translate >= topLoadDistance ? topDropText : topPullText,
      });
    }
  }

  onContentTouchEnd() {
    console.info('=== onContentTouchEnd ===');
    const { translate, topStatus } = this.state;
    const { topLoadingText, topPullText, onTopLoad } = this.props;
    if (
      this.direction === 'down' &&
      getScrollTop(this.scrollEventTarget) === 0 &&
      translate > 0
    ) {
      console.info('=== onContentTouchEnd pullrefresh ===');
      this.topDropped = true;
      if (topStatus === 'drop') {
        this.setState({
          translate: 30,
          topStatus: 'loading',
          topText: topLoadingText,
        });
        onTopLoad();
      } else {
        this.setState({
          translate: 0,
          topStatus: 'pull',
          topText: topPullText,
        });
      }
    }
  }

  onTopLoaded() {
    const { topPullText } = this.props;
    this.setState({
      translate: 0,
      topStatus: 'pull',
      topText: topPullText,
    });
  }
}

export default PullRefresh;
