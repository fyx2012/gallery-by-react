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
var ImgFigure = React.createClass({
	render: function(){
		return (
			<figure> 
				<img />
				<figcaption>
					<h2></h2>
				</figcaption>
			</figure>
			);
	}
});
var GalleryByReactApp = React.createClass({
  render: function() {
  	var controllerUnits = [],
		ImgFigures = [];
	imageDatas.forEach(function(value){
		<ImgFigure data={value}/>
	});
  return (<section className="stage" ref="stage"><section className="img-sec"></section><nav className="controller-nav"></nav></section>);
  }
});
React.render(<GalleryByReactApp />, document.getElementById('content')); // jshint ignore:line

module.exports = GalleryByReactApp;
