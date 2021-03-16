import React from 'react';
import classNames from 'classnames'
import PropTypes, { InferProps } from 'prop-types'
// @ts-ignore 
import { AtActivityIndicatorProps } from 'types/activity-indicator'
import { View, Text } from '@tarojs/components';
import AtLoading from '../AtLoading/AtLoading';
import AtComponent from '../../common/component'


interface AtActivityIndicatorState {
}

export default class AtActivityIndicator extends AtComponent<AtActivityIndicatorProps, AtActivityIndicatorState> {
    
    public static defaultProps: AtActivityIndicatorProps
    public static propTypes: InferProps<AtActivityIndicatorProps>

    constructor(props: AtActivityIndicatorProps) {
        super(props);
        this.state = {
        };
    }

    public render(): JSX.Element {
        const { color, size, mode, content, isOpened } = this.props

        const rootClass = classNames(
        'at-activity-indicator',
        {
            'at-activity-indicator--center': mode === 'center',
            'at-activity-indicator--isopened': isOpened
        },
        this.props.className
        )

        return (
            <View className={rootClass}>
                <View className='at-activity-indicator__body'>
                <AtLoading size={size} color={color} />
                </View>
                {content && (
                <Text className='at-activity-indicator__content'>{content}</Text>
                )}
            </View>
        );
    }
}

AtActivityIndicator.defaultProps = {
    size: 0,
    mode: 'normal',
    color: '',
    content: '',
    className: '',
    isOpened: true
  }
  
  AtActivityIndicator.propTypes = {
    size: PropTypes.number,
    mode: PropTypes.string,
    color: PropTypes.string,
    content: PropTypes.string,
    className: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    isOpened: PropTypes.bool
  }
  