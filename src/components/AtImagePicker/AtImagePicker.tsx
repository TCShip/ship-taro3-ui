import React from 'react'
import Taro from '@tarojs/taro';
import PropTypes, {InferProps } from 'prop-types'
// @ts-ignore 
import { AtImagePickerProps, AtImagePickerState } from 'types/image-picker'
import classNames  from 'classnames';

import { Image, View, Swiper, SwiperItem } from '@tarojs/components'
import AtComponent from '../../common/component'
import AtIcon from '../AtIcon/AtIcon'

import { uuid, handleTouchScroll } from '../../common/utils';

interface MatrixFile extends Partial<File> {
  type: 'blank' | 'btn'
  uuid: string
}
  
// 生成 jsx 二维矩阵
const generateMatrix = (
  files: MatrixFile[],
  col: number,
  showAddBtn: boolean
) => {
  const matrix: Array<MatrixFile>[] = []
  const length = showAddBtn ? files.length + 1 : files.length
  const row = Math.ceil(length / col)
  for (let i = 0; i < row; i++) {
    if (i === row - 1) {
      // 最后一行数据加上添加按钮
      const lastArr = files.slice(i * col)
      if (lastArr.length < col) {
        if (showAddBtn) {
          lastArr.push({ type: 'btn', uuid: uuid() })
        }
        // 填补剩下的空列
        for (let j = lastArr.length; j < col; j++) {
          lastArr.push({ type: 'blank', uuid: uuid() })
        }
      }
      matrix.push(lastArr)
    } else {
      matrix.push(files.slice(i * col, (i + 1) * col))
    }
  }
  return matrix
}

const ENV = Taro.getEnv()
  

export default class AtImagePicker extends AtComponent<AtImagePickerProps, AtImagePickerState> {

    public static defaultProps: AtImagePickerProps
    public static propTypes: InferProps<AtImagePickerProps>

    constructor(props: AtImagePickerProps) {
        super(props);
        this.state = {
          showPreview: false,
          previewIndex: 0
        };
    }
        
    private chooseFile = (): void => {
        const { files = [], multiple, count, sizeType, sourceType } = this.props
        const filePathName =
        ENV === Taro.ENV_TYPE.ALIPAY ? 'apFilePaths' : 'tempFiles'
        // const count = multiple ? 99 : 1
        const params: any = {}
        if (multiple) {
        params.count = 99
        }
        if (count) {
        params.count = count
        }
        if (sizeType) {
        params.sizeType = sizeType
        }
        if (sourceType) {
        params.sourceType = sourceType
        }
        Taro.chooseImage(params)
        .then(res => {
            const targetFiles = res.tempFilePaths.map((path, i) => ({
            url: path,
            file: res[filePathName][i]
            }))
            const newFiles = files.concat(targetFiles)
            this.props.onChange(newFiles, 'add')
        })
        .catch(this.props.onFail)
    }

    private handleImageClick = (idx: number, e): void => {
      e.stopPropagation()
      const { preview } = this.props;
      if(preview) {
        this.showGallery(idx)
        return;
      }
      this.props.onImageClick && this.props.onImageClick(idx, this.props.files[idx])
    }

    private showGallery = (idx: number):void => {
      handleTouchScroll(true)
      this.setState({
        showPreview: true,
        previewIndex: idx
      })
    }

    private closeGallery = () => {
      
      handleTouchScroll(false)
      this.setState({
        showPreview: false
      })
    }

    private handleRemoveImg = (idx: number, e): void => {
      e.stopPropagation()
      const { files = [] } = this.props
      if (ENV === Taro.ENV_TYPE.WEB) {
        window.URL.revokeObjectURL(files[idx].url)
      }
      const newFiles = files.filter((_, i) => i !== idx)
      this.props.onChange(newFiles, 'remove', idx)

      this.closeGallery();
    }

    private onChangeSwiper = (e): void => {
      this.setState({
        previewIndex: e.detail.current
      })
    }

    public render(): JSX.Element {
      const { showPreview, previewIndex } = this.state;
      const {
          className,
          customStyle,
          files,
          mode,
          length = 4,
          showAddBtn = true,
          canRemove = true,
          maxLength
        } = this.props
        const rowLength = length <= 0 ? 1 : length
        // 行数
        let _showAddBtn = maxLength &&  maxLength > 0? files.length < maxLength: showAddBtn
        if(!showAddBtn) {
          _showAddBtn = false
        }
        const matrix = generateMatrix(files as MatrixFile[], rowLength, _showAddBtn)
        const rootCls = classNames('at-image-picker', className)
        return (
            <View className={rootCls} style={customStyle}>
                {matrix.map((row, i) => (
                <View className='at-image-picker__flex-box' key={i + 1}>
                    {row.map((item:any, j) =>
                    item.url ? (
                        <View
                          className='at-image-picker__flex-item'
                          key={i * length! + j}
                        >
                        <View className='at-image-picker__item'>
                          {
                            canRemove? (<View
                              className='at-image-picker__remove-btn'
                              onClick={this.handleRemoveImg.bind(this, i * length! + j)}
                            ></View>): null
                          }
                            
                            <Image
                              className='at-image-picker__preview-img'
                              mode={mode}
                              src={item.url}
                              onClick={this.handleImageClick.bind(
                                this,
                                i * length! + j
                            )}
                            />
                        </View>
                        </View>
                    ) : (
                        <View
                          className={classNames('at-image-picker__flex-item')}
                          key={i * length! + j}
                        >
                        {item.type === 'btn' && (
                            <View
                              className='at-image-picker__item at-image-picker__choose-btn'
                              onClick={this.chooseFile}
                            >
                            <View className='add-bar'></View>
                            <View className='add-bar'></View>
                            </View>
                        )}
                        </View>
                      )
                    )}
                </View>
                ))}


                {
                  showPreview? (<View className='at-image-picker__gallery' onClick={this.closeGallery.bind(this)}>
                    <View className='at-image-picker__gallery-imgs'>
                      <Swiper
                        className='at-image-picker__gallery-swiper'
                        current={previewIndex}
                        indicatorDots={false}
                        onChange={this.onChangeSwiper}
                      >
                          {
                            files.map((file) => {
                              return (<SwiperItem>
                                <View className='at-image-picker__gallery-img' style={{backgroundImage: `url(${file.url})`}}></View>
                              </SwiperItem>)
                            })
                          }
                      </Swiper>
                    </View>
                    {
                      canRemove? (<View className='at-image-picker__gallery-footer' onClick={this.handleRemoveImg.bind(this, previewIndex)}>
                        <AtIcon value='trash' color='#fff' size='50'></AtIcon>
                      </View>): null
                    }
                    
                  </View>): null
                }
                
            </View>
        );
    }
}

AtImagePicker.defaultProps = {
  className: '',
  customStyle: '',
  files: [],
  mode: 'aspectFill',
  showAddBtn: true,
  multiple: false,
  length: 4,
  maxLength: 10,
  preview: false,
  canRemove: false, 
  onChange: () => {},
  onImageClick: () => {},
  onFail: () => {}
}

AtImagePicker.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  customStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  files: PropTypes.array,
  mode: PropTypes.oneOf([
    'scaleToFill',
    'aspectFit',
    'aspectFill',
    'widthFix',
    'top',
    'bottom',
    'center',
    'left',
    'right',
    'top left',
    'top right',
    'bottom left',
    'bottom right'
  ]),
  showAddBtn: PropTypes.bool,
  multiple: PropTypes.bool,
  length: PropTypes.number,
  onChange: PropTypes.func,
  onImageClick: PropTypes.func,
  onFail: PropTypes.func,
  count: PropTypes.number,
  sizeType: PropTypes.array,
  sourceType: PropTypes.array
}
