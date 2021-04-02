import React from 'react';
import Taro from '@tarojs/taro';
import PropTypes, {InferProps } from 'prop-types'
// @ts-ignore 
import { AtModalProps, AtModalState } from 'types/modal'
import classNames from 'classnames'
import { View, Text, Button, RichText } from '@tarojs/components';
import _isFunction from 'lodash/isFunction'
import { CommonEvent } from "@tarojs/components/types/common"
import { handleTouchScroll } from '../../common/utils'
import AtComponent from '../../common/component';
import AtModalHeader from '../AtModalHeader/AtModalHeader'
import AtModalAction from '../AtModalAction/AtModalAction'
import AtModalContent from '../AtModalContent/AtModalContent'

export default class AtModal extends AtComponent<AtModalProps, AtModalState> {
    public static defaultProps: AtModalProps
    public static propTypes: InferProps<AtModalProps>
    constructor(props: AtModalProps) {
        super(props);
        const { isOpened } = props
        this.state = {
            _isOpened: isOpened,
            isWEB: Taro.getEnv() === Taro.ENV_TYPE.WEB,
        };
    }

        
    public componentWillReceiveProps (nextProps: AtModalProps): void {
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

    private handleClickOverlay = (): void => {
        if (this.props.closeOnClickOverlay) {
        this.setState(
            {
            _isOpened: false
            },
            this.handleClose
        )
        }
    }

    private handleClose = (event?: CommonEvent): void => {
        if (_isFunction(this.props.onClose)) {
            this.props.onClose && this.props.onClose(event!)
        }
    }

    private handleCancel = (event: CommonEvent): void => {
        if (_isFunction(this.props.onCancel)) {
        this.props.onCancel && this.props.onCancel(event)
        }
    }

    private handleConfirm = (event: CommonEvent): void => {
        if (_isFunction(this.props.onConfirm)) {
            this.props.onConfirm && this.props.onConfirm(event)
        }
    }

    private handleTouchMove = (e: CommonEvent): void => {
        e.stopPropagation()
    }

    public render(): JSX.Element {
        const { _isOpened, isWEB } = this.state
        const { title, subContent, content, cancelText, confirmText } = this.props
        const rootClass = classNames(
        'at-modal',
        {
            'at-modal--active': _isOpened
        },
        this.props.className
        )

        if (title || content) {
        const isRenderAction = cancelText || confirmText
        return (
            <View className={rootClass}>
            <View
              onClick={this.handleClickOverlay}
              className='at-modal__overlay'
            />
            <View className='at-modal__container'>
                {title && (
                <AtModalHeader>
                    <Text>{title}</Text>
                </AtModalHeader>
                )}
                {(content || subContent) && (
                <AtModalContent>
                    {
                        content && (<View className='content-simple'>
                        { isWEB ? <Text dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }}></Text> : <RichText space='nbsp' nodes={content}></RichText> }
                        </View>)
                    }
                    {
                        subContent && (<View className='content-simple-sub'>
                        { isWEB ? <Text>{subContent}</Text>: <Text>{subContent}</Text> }
                        </View>)
                    }
                    
                </AtModalContent>
                )}
                {isRenderAction && (
                <AtModalAction isSimple>
                    {cancelText && (
                    <Button className='at-modal__btn' onClick={this.handleCancel}>{cancelText}</Button>
                    )}
                    {confirmText && (
                    <Button className='at-modal__btn' onClick={this.handleConfirm}>{confirmText}</Button>
                    )}
                </AtModalAction>
                )}
            </View>
            </View>
        );
        }

        return (
        <View onTouchMove={this.handleTouchMove} className={rootClass}>
            <View className='at-modal__overlay' onClick={this.handleClickOverlay} />
            <View className='at-modal__container'>{this.props.children}</View>
        </View>
        )
    }
}

AtModal.defaultProps = {
    isOpened: false,
    closeOnClickOverlay: true
  }

AtModal.propTypes = {
  title: PropTypes.string,
  isOpened: PropTypes.bool,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  onClose: PropTypes.func,
  content: PropTypes.string,
  closeOnClickOverlay: PropTypes.bool,
  cancelText: PropTypes.string,
  confirmText: PropTypes.string
}
  