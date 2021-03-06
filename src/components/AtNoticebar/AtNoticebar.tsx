import React from 'react';
import Taro from '@tarojs/taro';
import PropTypes, {InferProps } from 'prop-types'
// @ts-ignore 
import { AtNoticeBarProps, AtNoticeBarState } from 'types/noticebar'
import classNames from 'classnames'
import { View, Text } from '@tarojs/components';
import { CommonEvent } from '@tarojs/components/types/common'
import AtComponent from '../../common/component';

export default class AtNoticebar extends AtComponent<AtNoticeBarProps, AtNoticeBarState> {
    
    public static defaultProps: AtNoticeBarProps
    public static propTypes: InferProps<AtNoticeBarProps>
    private timeout: NodeJS.Timeout | null
    private interval: NodeJS.Timer
    constructor(props: AtNoticeBarProps) {
        super(props);
        const animElemId = `J_${Math.ceil(Math.random() * 10e5).toString(36)}`
        this.state = {
            show: true,
            animElemId,
            animationData: [{}],
            dura: 15,
            isWEAPP: Taro.getEnv() === Taro.ENV_TYPE.WEAPP,
            isALIPAY: Taro.getEnv() === Taro.ENV_TYPE.ALIPAY,
            isWEB: Taro.getEnv() === Taro.ENV_TYPE.WEB,
        };
    }

    private onClose (event: CommonEvent): void {
        this.setState({
          show: false,
        })
        this.props.onClose && this.props.onClose(event)
      }
    
      private onGotoMore (event: CommonEvent): void {
        this.props.onGotoMore && this.props.onGotoMore(event)
      }
    
      public componentWillReceiveProps (): void {
        if (!this.timeout) {
          this.interval && clearInterval(this.interval)
        }
      }
    
      public componentDidMount (): void {
        if (!this.props.marquee) return
      }

    public render(): JSX.Element {
        const {
            single,
            icon,
            marquee,
            customStyle,
          } = this.props
          let {
            showMore,
            close,
          } = this.props
          const { dura } = this.state
          const rootClassName = ['at-noticebar']
          let _moreText = this.props.moreText
      
          if (!single) showMore = false
      
          if (!_moreText) _moreText = '????????????'
      
          const style = {}
          const innerClassName = ['at-noticebar__content-inner']
          if (marquee) {
            close = false
            style['animation-duration'] = `${dura}s`
            innerClassName.push(this.state.animElemId)
          }
      
          const classObject = {
            'at-noticebar--marquee': marquee,
            'at-noticebar--weapp': marquee && (this.state.isWEAPP || this.state.isALIPAY),
            'at-noticebar--single': !marquee && single,
          }
      
          const iconClass = ['at-icon']
          if (icon) iconClass.push(`at-icon-${icon}`)
        return (
            this.state.show? (<View
              className={classNames(rootClassName, classObject, this.props.className)}
              style={customStyle}
            >
                {close && (
                <View className='at-noticebar__close' onClick={this.onClose.bind(this)}>
                    <Text className='at-icon at-icon-close'></Text>
                </View>
                )}
                <View className='at-noticebar__content'>
                {icon && (
                    <View className='at-noticebar__content-icon'>
                    {/* start hack ??????????????? */}
                    <Text className={classNames(iconClass, iconClass)}></Text>
                    </View>
                )}
                <View className='at-noticebar__content-text'>
                    <View className={classNames(innerClassName)} style={style}>{this.props.children}</View>
                </View>
                </View>
                {showMore && (
                <View className='at-noticebar__more' onClick={this.onGotoMore.bind(this)}>
                    <Text className='text'>{_moreText}</Text>
                    <View className='at-noticebar__more-icon'>
                    <Text className='at-icon at-icon-chevron-right'></Text>
                    </View>
                </View>
                )}
            </View>): <View></View>
            
        );
    }
}

AtNoticebar.defaultProps = {
  close: false,
  single: false,
  marquee: false,
  speed: 100,
  moreText: '????????????',
  showMore: false,
  icon: '',
  customStyle: {},
  onClose: () => {},
  onGotoMore: () => {}
}

AtNoticebar.propTypes = {
  close: PropTypes.bool,
  single: PropTypes.bool,
  marquee: PropTypes.bool,
  speed: PropTypes.number,
  moreText: PropTypes.string,
  showMore: PropTypes.bool,
  icon: PropTypes.string,
  customStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  onClose: PropTypes.func,
  onGotoMore: PropTypes.func
}
