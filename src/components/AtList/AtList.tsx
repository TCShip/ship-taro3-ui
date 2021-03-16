import React from 'react';
import classNames from 'classnames'
import PropTypes, {InferProps } from 'prop-types'
// @ts-ignore 
import { AtListProps } from 'types/list'
import { View } from '@tarojs/components';
import AtComponent from '../../common/component';

export default class AtList extends AtComponent<AtListProps> {
    public static defaultProps: AtListProps
    public static propTypes: InferProps<AtListProps>
    constructor(props: AtListProps) {
        super(props);
        this.state = {
        };
    }

    public render(): JSX.Element {
        const rootClass = classNames('at-list',{
          'at-list--no-border': !this.props.hasBorder
        },this.props.className)
        return (
            <View className={rootClass}>{this.props.children}</View>
        );
    }
}

AtList.defaultProps = {
    hasBorder: true
  }
  
  AtList.propTypes = {
    hasBorder: PropTypes.bool
  }
  