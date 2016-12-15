'use strict';

var React = require('react/addons');


// CSS
require('normalize.css');
require('../styles/main.css');
// 获取图片相关的数据
var imageDatas = require('../data/imageDatas.json');

// 利用自执行函数， 将图片名信息转成图片URL路径信息
imageDatas = (function genImageURL(imageDatasArr) {
    for (var i = 0, j = imageDatasArr.length; i < j; i++) {
        var singleImageData = imageDatasArr[i];

        singleImageData.imageURL = require('../images/' + singleImageData.fileName);

        imageDatasArr[i] = singleImageData;
    }

    return imageDatasArr;
})(imageDatas);
function getRangeRandom(low, high){
	return Math.ceil(Math.random() * (high - low) + low);

}

var ImgFigure = React.createClass({
	render: function(){
		var styleObj = {};
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
		}
		return (
        <figure className="img-figure" style={styleObj}>
            <img src={this.props.data.imageURL}
							alt={this.props.data.title} />
						<figcaption>
							<h2 className="img-title">{this.props.data.title}</h2>
						</figcaption>
				</figure>
			);
	}
});
var GalleryByReactApp = React.createClass({
  Constant: {
		centerPos: {
			left: 0,
			right: 0
		},
		hPosRange: {//水平方向的取值范围
			leftSecX: [0, 0],
			rightSecX: [0, 0],
			y: [0, 0]
		},
		vPosRange: {//垂直方向的取值范围
			x: [0, 0],
			topY: [0, 0]
		}
	},
  //指定居中排布哪个图片
  rearrange: function(centerIndex){
	var imgsArrangeArr = this.state.imgsArrangeArr,
		Constant = this.Constant,
		centerPos = Constant.centerPos,
		hPosRange = Constant.hPosRange,
		vPosRange = Constant.vPosRange,
		hPosRangeLeftSecX = hPosRange.leftSecX,
		hPosRangeRightSecX = hPosRange.rightSecX,
		hPosRangeY = hPosRange.y,
		vPosRangeTopY = vPosRange.topY,
		vPosRangeX = vPosRange.x,

		imgsArrangeTopArr = [],
		topImgNum = (Math.random() * 2), //取0或者1个
		topImgSpliceIndex = 0,
		imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
		imgsArrangeCenterArr[0].pos = centerPos;

		//取出要布局上侧的图片的状态信息
		topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeCenterArr.length - topImgNum));
		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
		//布局位于上侧的信息
		imgsArrangeTopArr.forEach(function(value, index){
			imgsArrangeTopArr[index].pos = {
				top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
				left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
			};
		});
		//布局位于两侧的信息
		for(var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++){
		var hPosRangeLORX = null;
			if(i < k){
				hPosRangeLORX = hPosRangeLeftSecX;
			}else{
				hPosRangeLORX = hPosRangeRightSecX;
			}
			imgsArrangeArr[i].pos = {
              top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
              left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
          };
		}
		if(imgsArrangeArr && imgsArrangeArr[0]){
			imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeArr[0]);
		}
		imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

          this.setState({
            imgsArrangeArr: imgsArrangeArr
          });
  },
  getInitialState: function(){
	return {
		imgsArrangeArr: []
	};
  },
  //组件加载以后，为每张图片计算其位置的范围
  componentDidMount: function(){

	var stageDOM = React.findDOMNode(this.refs.stage),
		stageW = stageDOM.scrollWidth,
		stageH = stageDOM.scrollHeight,
		halfStageW = Math.ceil(stageW / 2),
		halfStageH = Math.ceil(stageH / 2);

	var imgFigureDOM = React.findDOMNode(this.refs.imgFigure0),
		imgW = imgFigureDOM.scrollWidth,
		imgH = imgFigureDOM.scrollHeight,
		halfImgW = Math.ceil(imgW / 2),
		halfImgH = Math.ceil(imgH / 2);

	this.Constant.centerPos = {
		left: halfStageW - halfImgW,
		top: halfStageH - halfImgH
	};
	//左右图片取值范围
	this.Constant.hPosRange.leftSecX[0] = -halfImgW;
	this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
	this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
	this.Constant.hPosRange.rightSecX[1] = halfStageW - halfImgW;
	this.Constant.hPosRange.y[0] = -halfImgH;
	this.Constant.hPosRange.y[1] = stageH - halfImgW;
	//上部图片取值范围
	this.Constant.vPosRange.topY[0] = -halfImgH;
	this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
	this.Constant.vPosRange.x[0] = halfImgW - imgW;
	this.Constant.vPosRange.x[1] = halfImgW;
	this.rearrange(0);

  },
  render: function() {
	var controllerUnits	=	[],
		ImgFigures = [];
	imageDatas.forEach(function (value, index) {

		if (!this.state.imgsArrangeArr[index]) {
            this.state.imgsArrangeArr[index] = {
                pos: {
                    left: 0,
                    top: 0
                }
            };
        }
		ImgFigures.push(<ImgFigure data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]}/>);
	}.bind(this));
  return (<section className="stage" ref="stage"><section className="img-sec">{ImgFigures}</section><nav className="controller-nav">{controllerUnits}</nav></section>);
  }
});
React.render(<GalleryByReactApp />, document.getElementById('content')); // jshint ignore:line

module.exports = GalleryByReactApp;
