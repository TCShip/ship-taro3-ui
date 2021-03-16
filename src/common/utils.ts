import Taro from '@tarojs/taro'
import { SelectorQuery } from '@tarojs/taro/types/index'
import _assign from 'lodash/assign'
import _keys from 'lodash/keys'


const objectToString = style => {
    if (style && typeof style === 'object') {
      let styleStr = ''
      _keys(style).forEach(key => {
        const lowerCaseKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
        styleStr += `${lowerCaseKey}:${style[key]};`
      })
      return styleStr
    } else if (style && typeof style === 'string') {
      return style
    }
    return ''
  }
/**
 * 合并 style
 * @param {Object|String} style1
 * @param {Object|String} style2
 * @returns {String}
 */
function mergeStyle(style1, style2) {
    if ((style1 && typeof style1 === 'object')
        && (style2 && typeof style2 === 'object')
    ) {
        return _assign({}, style1, style2)
    }
    return objectToString(style1) + objectToString(style2)
}


const ENV = Taro.getEnv()

function delay(delayTime = 500): Promise<null> {
  return new Promise(resolve => {
    if ([Taro.ENV_TYPE.WEB, Taro.ENV_TYPE.SWAN].includes(ENV)) {
      setTimeout(() => {
        resolve()
      }, delayTime)
      return
    }
    resolve()
  })
}

function delayQuerySelector(
  self,
  selectorStr: string,
  delayTime = 500
): Promise<Array<any>> {
  const $scope = ENV === Taro.ENV_TYPE.WEB ? self : self.$scope
  const selector: SelectorQuery = Taro.createSelectorQuery().in($scope)
  return new Promise(resolve => {
    delay(delayTime).then(() => {
      selector
        .select(selectorStr)
        .boundingClientRect()
        .exec((res: Array<any>) => {
          resolve(res)
        })
    })
  })
}

function delayGetScrollOffset({ delayTime = 500 }): Promise<Array<any>> {
  return new Promise(resolve => {
    delay(delayTime).then(() => {
      Taro.createSelectorQuery()
        .selectViewport()
        .scrollOffset()
        .exec((res: Array<any>) => {
          resolve(res)
        })
    })
  })
}

function delayGetClientRect({
  self,
  selectorStr,
  delayTime = 500
}): Promise<Array<any>> {
  const $scope =
    ENV === Taro.ENV_TYPE.WEB || ENV === Taro.ENV_TYPE.SWAN ? self : self.$scope
  const selector: SelectorQuery = Taro.createSelectorQuery().in($scope)

  return new Promise(resolve => {
    delay(delayTime).then(() => {
      selector
        .select(selectorStr)
        .boundingClientRect()
        .exec((res: Array<any>) => {
          resolve(res)
        })
    })
  })
}

function uuid(len = 8, radix = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  const value: string[] = []
  let i = 0
  radix = radix || chars.length

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) value[i] = chars[0 | (Math.random() * radix)]
  } else {
    // rfc4122, version 4 form
    let r

    // rfc4122 requires these characters
    /* eslint-disable-next-line */
    value[8] = value[13] = value[18] = value[23] = '-'
    value[14] = '4'

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!value[i]) {
        r = 0 | (Math.random() * 16)
        value[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return value.join('')
}
function initTestEnv() {
  if (process.env.NODE_ENV === 'test') {
    Taro.initPxTransform({
      designWidth: 750,
      deviceRatio: {}
    })
  }
}

let scrollTop = 0
function handleTouchScroll(flag) {
  if (ENV !== Taro.ENV_TYPE.WEB) {
    return
  }
  if (flag) {
    scrollTop = document.documentElement.scrollTop
    // 使body脱离文档流
    document.body.classList.add('at-frozen')

    // 把脱离文档流的body拉上去！否则页面会回到顶部！
    document.body.style.top = `${-scrollTop}px`
  } else {
    // document.body.style.top = null
    document.body.classList.remove('at-frozen')

    document.documentElement.scrollTop = scrollTop
  }
}


function isTest() {
  return process.env.NODE_ENV === 'test'
}



/**
 * 计算内容容器距离顶部的高度
 * @returns {String} 距离顶部高度
 */
function getHeightToTop(offsetTop: number | undefined = 0, isTouch, SHIP_NAV_HEIGHT) {
  let top: number = offsetTop // 初始值
  if (isTouch) {
      top += SHIP_NAV_HEIGHT // M站导航栏的高度
  }
  return Taro.pxTransform(top, 750)
}

function pxTransform(size: number): string {
    if (!size) return ''
    return Taro.pxTransform(size, 750)
  }

export {
  mergeStyle,
  delayQuerySelector,
  delayGetScrollOffset,
  delayGetClientRect,
  uuid,
  initTestEnv,
  handleTouchScroll,
  isTest,
  getHeightToTop,
  pxTransform
}
