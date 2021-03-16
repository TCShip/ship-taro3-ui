import React from 'react';
import Taro from '@tarojs/taro';
import classnames from 'classnames'
import PropTypes, {InferProps } from 'prop-types'
import { View, Block } from '@tarojs/components';
// @ts-ignore 
import { SkeletonProps } from 'types/skeleton'
import AtComponent from '../../common/component';
import { initTestEnv } from '../../common/utils';

const DEFAULT_ROW_WIDTH = '100%';

initTestEnv()

export default class Skeleton extends AtComponent<SkeletonProps> {
    public static defaultProps: SkeletonProps
    public static propTypes: InferProps<SkeletonProps>
    constructor(props: SkeletonProps) {
        super(props);
        this.state = {
        };
        
    }


    
  getRowWidth(index: number) {
    const { rowProps, rowWidth } = this.props
    if (rowProps) {
      if (Array.isArray(rowProps)) {
        return rowProps[index].width
      }
      return rowProps.width
    }

    if (rowWidth === DEFAULT_ROW_WIDTH) {
      return DEFAULT_ROW_WIDTH
    }
    if (Array.isArray(rowWidth)) {
      return rowWidth[index]
    }
    return rowWidth
  }

  getRowHeight(index: number) {
    const { rowProps, rowHeight } = this.props
    if (rowProps) {
      if (Array.isArray(rowProps)) {
        return rowProps[index].height
      }
      return rowProps.height
    }

    if (Array.isArray(rowHeight)) {
      return rowHeight[index]
    }
    return rowHeight
  }


  addUnit(value?: string | number) {
    return typeof value === 'number' ? Taro.pxTransform(value, 750) : value
  }
 
  renderRows(): JSX.Element | null {
    const { row } = this.props
    if (row) {
      const rowArray = Array.apply(null, Array(row)).map((index) => index)
      const Rows = rowArray.map((item, index) => {
        return <View key={item} className='skeleton-row' style={`width: ${this.addUnit(this.getRowWidth(index))};height: ${this.addUnit(this.getRowHeight(index))}`} />
      })
      return <View className='skeleton-rows'>{Rows}</View>
    }
    return null
  }

  renderMatrix(): JSX.Element | null {
    const { matrix } = this.props
    if(matrix) {
      let Boxes: any = []
      // [
      //   [2,2,2,1],
      //   [2,2,2]
      // ]
      matrix.map((items: Array<Number>, index) => {
        let Rows:any = []
        items.map((item: Number, cIndex) => {
          let Cols: any = []
          
          let i = 0
          while(item > i) {
            Cols.push(<View key={i} className='skeleton-matrix-row' />);
            i++
          }
          Rows.push(<View key={cIndex} className='skeleton-matrix-col'>{Cols}</View>)
        })
        Boxes.push(<View className='skeleton-matrix-rows' key={index}>{Rows}</View>)
      })
      return Boxes
    }
    return null
  }


    public render(): JSX.Element {
      const { loading, type, matrix, animate, animateName, className, customStyle, contentAlignStyle, children } = this.props
      
      if (!loading) {
        return <Block>{children}</Block>
      }


      const rootClass = classnames('skeleton', 'skeleton-custom-class', {
        [`skeleton-type-${type}`]: true,
        'skeleton-matrix': matrix,
        'skeleton-animate-blink': animate && animateName === 'blink',
        'skeleton-animate-elastic': animate && animateName === 'elastic'
      })
      return (
        <View className={classnames(rootClass, className)} style={customStyle}>
          <View className='skeleton-content' style={{textAlign: contentAlignStyle}}>
            {this.renderRows()}
            {this.renderMatrix()}
          </View>
        </View>
      );
    }
}


Skeleton.defaultProps = {
    type: 'row',
    row: 0,
    col: 0,
    loading: true,
    animate: true,
    rowWidth: '100%',
    rowHeight: 24,
    animateName: 'blink',
    contentAlignStyle: 'left'
}

Skeleton.options = {
  addGlobalClass: true
}

Skeleton.propTypes = {
  type: PropTypes.string,
  row: PropTypes.number,
  col: PropTypes.number,
  loading: PropTypes.bool,
  animate: PropTypes.bool,
  rowWidth: PropTypes.string,
  rowHeight: PropTypes.number,
  animateName: PropTypes.string,
  contentAlignStyle: PropTypes.string,
}
