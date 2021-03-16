import React from 'react';
import PropTypes, {InferProps} from 'prop-types'
// @ts-ignore 
import { AtFloatLayoutProps, AtFloatLayoutState } from 'types/float-layout'
import { View, Text, ScrollView } from '@tarojs/components'
import classNames from 'classnames'
import _isFunction from 'lodash/isFunction'
import { handleTouchScroll } from '../../common/utils'
import AtComponent from '../../common/component'

export default class AtFloatLayout extends AtComponent<AtFloatLayoutProps, AtFloatLayoutState> {
    public static defaultProps: AtFloatLayoutProps
    public static propTypes: InferProps<AtFloatLayoutProps>
    constructor(props: AtFloatLayoutProps) {
        super(props)
        const { isOpened } = props
        this.state = {
            _isOpened: isOpened
        }
    }

    componentWillReceiveProps (nextProps) {
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
    
    componentWillUnmount () {
        // 弹框组件销毁时，重置状态，清除禁止滚动的处理
        handleTouchScroll(false)
    }

    handleClose = (e?:any) => {
        if (_isFunction(this.props.onClose)) {
            this.props.onClose && this.props.onClose(e)
        }
    }
    
    close = () => {
        this.setState(
            {
                _isOpened: false
            },
            this.handleClose
        )
    }
    
    handleTouchMove = e => {
        e.stopPropagation()
    }

    public render(): JSX.Element {
        const { _isOpened } = this.state
        const {
            title,
            subTitle,
            scrollY,
            scrollX,
            scrollTop,
            scrollLeft,
            upperThreshold,
            lowerThreshold,
            scrollWithAnimation
        } = this.props
        const rootClass = classNames(
            'at-float-layout',
            {
                'at-float-layout--active': _isOpened
            },
            this.props.className
        )
        return (
            <View className={rootClass} onTouchMove={this.handleTouchMove}>
                <View onClick={this.close} className='at-float-layout__overlay' />
                <View className='at-float-layout__container layout'>
                    {title ? (
                        <View className='layout-header'>
                            <Text className='layout-header__title'>{title}</Text>
                            {
                                subTitle && <Text className='layout-header__title layout-header__title-sub'>{subTitle}</Text>
                            }
                            
                            <View className='layout-header__btn-close' onClick={this.close} />
                        </View>
                    ) : null}
                    <View className='layout-body'>
                        <ScrollView
                          scrollY={scrollY}
                          scrollX={scrollX}
                          scrollTop={scrollTop}
                          scrollLeft={scrollLeft}
                          upperThreshold={upperThreshold}
                          lowerThreshold={lowerThreshold}
                          scrollWithAnimation={scrollWithAnimation}
                          onScroll={this.props.onScroll}
                          onScrollToLower={this.props.onScrollToLower}
                          onScrollToUpper={this.props.onScrollToUpper}
                          className='layout-body__content'
                        >
                            {this.props.children}
                        </ScrollView>
                    </View>
                </View>
            </View>
        )
    }
}


AtFloatLayout.defaultProps = {
    title: '',
    isOpened: false,
  
    scrollY: true,
    scrollX: false,
    scrollWithAnimation: false,
  
    onClose: () => {},
    onScroll: () => {},
    onScrollToLower: () => {},
    onScrollToUpper: () => {}
  }
  
  AtFloatLayout.propTypes = {
    title: PropTypes.string,
    isOpened: PropTypes.bool,
    scrollY: PropTypes.bool,
    scrollX: PropTypes.bool,
    scrollTop: PropTypes.number,
    scrollLeft: PropTypes.number,
    upperThreshold: PropTypes.number,
    lowerThreshold: PropTypes.number,
    scrollWithAnimation: PropTypes.bool,
    onClose: PropTypes.func,
    onScroll: PropTypes.func,
    onScrollToLower: PropTypes.func,
    onScrollToUpper: PropTypes.func
  }
  