import React from 'react';
import classNames from 'classnames'
import PropTypes, { InferProps } from 'prop-types'
// @ts-ignore 
import { AtCurtainProps, AtCurtainState } from 'types/curtain'
import { View } from '@tarojs/components';
import { CommonEvent } from '@tarojs/components/types/common'
import { handleTouchScroll } from '../../common/utils'
import AtComponent from '../../common/component'

export default class AtCurtain extends AtComponent<AtCurtainProps, AtCurtainState> {
    // static defaultProps = {
    //     customStyle: '',
    //     className: '',
    //     isOpened: false,
    //     closeBtnPosition: 'bottom',
    //     onClose: () => {},
    // }
  	public static defaultProps: AtCurtainProps
    public static propTypes: InferProps<AtCurtainProps>
    constructor(props: AtCurtainProps) {
        super(props);
        const { isOpened } = props
        this.state = {
            _isOpened: isOpened
        };
    }
    public componentWillReceiveProps (nextProps: AtCurtainProps): void {
      const { isOpened } = nextProps

      if (this.props.isOpened !== isOpened) {
          handleTouchScroll(isOpened)
      }

      if (isOpened !== this.state._isOpened) {
        this.setState({
            _isOpened: isOpened
        })
      }
  }
    private onClose (e: CommonEvent): void {
        e.stopPropagation()
        this.props.onClose(e)
      }
    
      private _stopPropagation (e: CommonEvent): void {
        e.stopPropagation()
      }
    

    public render(): JSX.Element {
        const {
            className,
            customStyle,
            closeBtnPosition
          } = this.props
        const { _isOpened } = this.state;
      
          const curtainClass = classNames({
            'at-curtain': true,
            'at-curtain--closed': !_isOpened
          }, className)
          const btnCloseClass = classNames({
            'at-curtain__btn-close': true,
            [`at-curtain__btn-close--${closeBtnPosition}`]: closeBtnPosition
          })
        return (
            <View
              className={curtainClass}
              style={customStyle}
              onClick={this._stopPropagation}
            >
                <View className='at-curtain__container'>
                <View className='at-curtain__body'>
                    {this.props.children}
                    <View className={btnCloseClass} onClick={this.onClose.bind(this)}></View>
                </View>
                </View>
            </View>
        );
    }
}


AtCurtain.defaultProps = {
  customStyle: '',
  className: '',
  isOpened: false,
  closeBtnPosition: 'bottom',
  onClose: () => {}
}

AtCurtain.propTypes = {
  customStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  className: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  isOpened: PropTypes.bool,
  closeBtnPosition: PropTypes.string,
  onClose: PropTypes.func
}
