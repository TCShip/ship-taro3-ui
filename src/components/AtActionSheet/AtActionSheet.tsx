import React from 'react';
import PropTypes, { InferProps } from 'prop-types'
import { View } from '@tarojs/components';
import { CommonEvent } from '@tarojs/components/types/common'
import classNames from 'classnames'
import _isFunction from 'lodash/isFunction'
// @ts-ignore 
import { AtActionSheetProps, AtActionSheetState } from 'types/action-sheet'
import AtComponent from '../../common/component'
import AtActionSheetBody from '../AtActionSheetBody/AtActionSheetBody'
import AtActionSheetHeader from '../AtActionSheetHeader/AtActionSheetHeader'
import AtActionSheetFooter from '../AtActionSheetFooter/AtActionSheetFooter'

export default class AtActionSheet extends AtComponent<AtActionSheetProps, AtActionSheetState> {
    public static defaultProps: AtActionSheetProps
    public static propTypes: InferProps<AtActionSheetProps>
    constructor(props: AtActionSheetProps) {
        super(props);
        const { isOpened } = props
        this.state = {
            _isOpened: isOpened
        };
    }

    public componentWillReceiveProps (nextProps: AtActionSheetProps): void {
        const { isOpened } = nextProps
        if (isOpened !== this.state._isOpened) {
        this.setState({
            _isOpened: isOpened
        })

        !isOpened && this.handleClose()
        }
    }

    private handleClose = (): void => {
        if (_isFunction(this.props.onClose)) {
            this.props.onClose && this.props.onClose()
        }
    }

    private handleCancel = (): void => {
        if (_isFunction(this.props.onCancel)) {
        return this.props.onCancel && this.props.onCancel()
        }
        this.close()
    }

    private close = (): void => {
        this.setState(
        {
            _isOpened: false
        },
        this.handleClose
        )
    }
    private handleTouchMove = (e: CommonEvent): void => {
      e.stopPropagation()
      e.preventDefault()
    }

    public render(): JSX.Element {
        const { title, cancelText, className } = this.props
        const { _isOpened } = this.state

        const rootClass = classNames(
        'at-action-sheet',
        {
            'at-action-sheet--active': _isOpened,
        },
        className
        )
        return (
            <View className={rootClass} onTouchMove={this.handleTouchMove}>
                <View onClick={this.close} className='at-action-sheet__overlay' />
                <View className='at-action-sheet__container'>
                {title? <AtActionSheetHeader>{title}</AtActionSheetHeader>: null}
                <AtActionSheetBody>{this.props.children}</AtActionSheetBody>
                {cancelText? (
                    <AtActionSheetFooter onClick={this.handleCancel}>
                    {cancelText}
                    </AtActionSheetFooter>
                ): null}
                </View>
            </View>
        );
    }
}

AtActionSheet.defaultProps = {
    title: '',
    cancelText: '',
    isOpened: false
}

AtActionSheet.propTypes = {
    title: PropTypes.string,
    onClose: PropTypes.func,
    onCancel: PropTypes.func,
    isOpened: PropTypes.bool.isRequired,
    cancelText: PropTypes.string
}