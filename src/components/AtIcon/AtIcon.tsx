import React from 'react';
import Taro from '@tarojs/taro';
import PropTypes, {InferProps} from 'prop-types'
// @ts-ignore 
import { AtIconProps } from 'types/icon'
import classnames from 'classnames';
import { Text } from '@tarojs/components';
import AtComponent from '../../common/component'

import { mergeStyle, initTestEnv } from '../../common/utils';

initTestEnv()

export default class AtIcon extends AtComponent<AtIconProps> {

  public static defaultProps: AtIconProps
  public static propTypes: InferProps<AtIconProps>

    constructor(props: AtIconProps) {
        super(props);
        this.state = {
        };
    }
    
    handleClick (e) {
      this.props.onClick && this.props.onClick(e)
    }

    public render(): JSX.Element {
        const {
            customStyle,
            className,
            prefixClass,
            value,
            size,
            color
          } = this.props
      
          const rootStyle = {
            fontSize: `${Taro.pxTransform(parseInt(String(size)), 750)}`,
            color
          }
      
          const iconName = value ? `${prefixClass}-${value}` : ''
        return (
            <Text
              className={classnames(
                    prefixClass,
                    iconName,
                    className
                )}
              style={mergeStyle(rootStyle, customStyle)}
              onClick={this.handleClick.bind(this)}
            >
            </Text>
        );
    }
}


AtIcon.defaultProps = {
    customStyle: '',
    className: '',
    prefixClass: 'at-icon',
    value: '',
    color: '',
    size: 24,
    onClick: () => {}
  }

AtIcon.propTypes = {
  customStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  className: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  prefixClass: PropTypes.string,
  value: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClick: PropTypes.func
}
  