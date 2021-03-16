import React from 'react';
import Taro from '@tarojs/taro';
import PropTypes, {InferProps } from 'prop-types'
// @ts-ignore 
import { AtTabsProps, AtTabsState } from 'types/tabs'
import { View, ScrollView } from '@tarojs/components'
import classNames from 'classnames'
import _assign from 'lodash/assign'
import AtBadge from '../AtBadge/AtBadge';
import AtComponent from '../../common/component';
import { uuid, isTest, mergeStyle, getHeightToTop } from '../../common/utils';

const ENV = Taro.getEnv()
const MIN_DISTANCE = 100
const MAX_INTERVAL = 10

export default class AtTabs extends AtComponent<AtTabsProps, AtTabsState> {
  public static defaultProps: AtTabsProps
  public static propTypes: InferProps<AtTabsProps>
  public _tabId: string = isTest() ? 'tabs-AOTU2018' : uuid()
  
  // 触摸时的原点
  private _touchDot: number = 0
  // 定时器
  public _timer: any = null
  // 滑动时间间隔
  private _interval: number = 0
  // 是否已经在滑动
  private _isMoving: boolean = false
  private tabHeaderRef: any;
  
  constructor(props: AtTabsProps) {
    super(props)
    this.state = {
      _scrollLeft: 0,
      _scrollTop: 0,
      _scrollIntoView: '',
      showTips: true
    }
  }

  componentWillMount() {
   
  }


  updateState = idx => {
    if (this.props.scroll) {
      // 标签栏滚动
      switch (ENV) {
        case Taro.ENV_TYPE.WEAPP:
        case Taro.ENV_TYPE.ALIPAY:
        case Taro.ENV_TYPE.SWAN:
          this.setState({
            _scrollIntoView: `tab${idx - 1}`
          })
          break

        case Taro.ENV_TYPE.WEB: {
          const index = Math.max(idx - 1, 0)
          const prevTabItem = this.tabHeaderRef.childNodes[index]
          prevTabItem && this.setState({
            _scrollTop: prevTabItem.offsetTop,
            _scrollLeft: prevTabItem.offsetLeft
          })
          break
        }

        default:
          console.warn('AtTab 组件在该环境还未适配')
          break
      }
    }
  }

  handleClick(current) {
    this.props.onClick(current)
  }

  handleTouchStart (e) {
    const { swipeable, tabDirection } = this.props
    if (!swipeable || tabDirection === 'vertical') return
    // 获取触摸时的原点
    this._touchDot = e.touches[0].pageX
    // 使用js计时器记录时间
    this._timer = setInterval(() => {
      this._interval++
    }, 100)
  }

  handleTouchMove (e) {
    const {
      swipeable,
      tabDirection,
      current,
      tabList
    } = this.props
    if (!swipeable || tabDirection === 'vertical') return

    const touchMove = e.touches[0].pageX
    const moveDistance = touchMove - this._touchDot
    const maxIndex = tabList.length

    if (!this._isMoving && this._interval < MAX_INTERVAL && this._touchDot > 20) {
      // 向左滑动
      if (current + 1 < maxIndex && moveDistance <= -MIN_DISTANCE) {
        this._isMoving = true
        this.handleClick(current + 1)

      // 向右滑动
      } else if (current - 1 >= 0 && moveDistance >= MIN_DISTANCE) {
        this._isMoving = true
        this.handleClick(current - 1)
      }
    }
  }

  handleTouchEnd () {
    const { swipeable, tabDirection } = this.props
    if (!swipeable || tabDirection === 'vertical') return

    clearInterval(this._timer)
    this._interval = 0
    this._isMoving = false
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.scroll !== this.props.scroll) {
      this.getTabHeaderRef()
    }
    if (nextProps.current !== this.props.current) {
      this.updateState(nextProps.current)
    }
  }

  getTabHeaderRef () {
    if (ENV === Taro.ENV_TYPE.WEB) {
      this.tabHeaderRef = document.getElementById(this._tabId)
    }
  }

  componentDidMount () {
    this.getTabHeaderRef()
    this.updateState(this.props.current)
    this.hideTipHandle()
  }

  componentWillUnmount () {
    console.log('componentWillUnmount... tabs')
    this.tabHeaderRef = null
  }

  componentDidHide() {
    console.log("componentDidHide ... tabs")
  }

  hideTipHandle() {
    setTimeout(() => {
      this.setState({
        showTips: false
      })
    }, 3000) 
  }

  public render(): JSX.Element {
    const {
      customStyle,
      className,
      height,
      tabDirection,
      animated,
      tabList,
      scroll,
      current,
      isTouch,
      navHeight
    } = this.props
    const {
      _scrollLeft,
      _scrollTop,
      _scrollIntoView,
      showTips
    } = this.state

    const heightStyle = { height }
    const underlineStyle = {
      height: tabDirection === 'vertical' ? `${tabList.length * 100}%` : '1PX',
      width: tabDirection === 'horizontal' ? `${tabList.length * 100}%` : '1PX'
    }
    const bodyStyle = { 
      transition: ''
     }
    let transformStyle = `translate3d(0px, -${current * 100}%, 0px)`
    if (tabDirection === 'horizontal') {
      transformStyle = `translate3d(-${current * 100}%, 0px, 0px)`
    }
    _assign(bodyStyle, {
      'transform': transformStyle,
      '-webkit-transform': transformStyle
    })
    if (!animated) {
      bodyStyle.transition = 'unset'
    }

    const tabItems = tabList.map((item:any, idx) => {
      const itemCls = classNames({
        'at-tabs__item': true,
        'at-tabs__item--active': current === idx
      })
      return <View
        className={itemCls}
        id={`tab${idx}`}
        key={item.title}
        onClick={this.handleClick.bind(this, idx)}
      >
        <AtBadge dot={item.dot} value={item.dotValue}>
          <View className='at-tabs__item-title'>
            {item.title}
            {
              item.tip && showTips? (<View className='at-tabs__item-tip'>{item.tip}</View>): null
            }
          </View>
      </AtBadge>
        
        
        <View className='at-tabs__item-underline'></View>
      </View>
    })
    const rootCls = classNames({
      'at-tabs': true,
      'at-tabs--scroll': scroll,
      [`at-tabs--${tabDirection}`]: true,
      [`at-tabs--${ENV}`]: true
    }, className)
    const scrollX = tabDirection === 'horizontal'
    const scrollY = tabDirection === 'vertical'

    return (
      <View>
        <View className='at-tabs__wrapper' style={`top: ${getHeightToTop(0, isTouch, navHeight)}`}>
            {
              scroll
                ? <ScrollView
                    id={this._tabId}
                    className='at-tabs__header'
                    style={heightStyle}
                    scrollX={scrollX}
                    scrollY={scrollY}
                    scrollWithAnimation
                    scrollLeft={_scrollLeft}
                    scrollTop={_scrollTop}
                    scrollIntoView={_scrollIntoView}
                >
                  {tabItems}
                </ScrollView>

                : <View
                    id={this._tabId}
                    className='at-tabs__header'
                >
                  {tabItems}
                </View>
            }
        </View>
        <View
          className={rootCls}
          style={mergeStyle(heightStyle, customStyle)}
        >
          
          <View
            className='at-tabs__body'
            onTouchStart={this.handleTouchStart.bind(this)}
            onTouchEnd={this.handleTouchEnd.bind(this)}
            onTouchMove={this.handleTouchMove.bind(this)}
            style={mergeStyle(bodyStyle, heightStyle)}
          >
            <View className='at-tabs__underline' style={underlineStyle}></View>
              {this.props.children}
          </View>
        </View>
      </View>
    )
  }
}

AtTabs.defaultProps = {
  customStyle: '',
  className: '',
  tabDirection: 'horizontal',
  height: '',
  current: 0,
  swipeable: true,
  scroll: false,
  animated: true,
  tabList: [],
  isTouch: true,
  navHeight: 0,
  onClick: () => {}
}

AtTabs.propTypes = {
  customStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  className: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  height: PropTypes.string,
  tabDirection: PropTypes.oneOf(['horizontal', 'vertical']),
  current: PropTypes.number,
  swipeable: PropTypes.bool,
  scroll: PropTypes.bool,
  animated: PropTypes.bool,
  tabList: PropTypes.array,
  onClick: PropTypes.func
}
