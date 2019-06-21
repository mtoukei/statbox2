// ミックスイン
export default {
  name: 'detectResize',
  methods: {
    mix_detectResize () {
      this.$nextTick(function () {
        const bodyHeight = document.body.clientHeight;
        const bodyWidth = document.body.clientWidth;
        const headerHeight = document.querySelector('#header-menu').clientHeight;
        const footerHeight = document.querySelector('#footer').clientHeight;
        const resizersLeft = document.querySelector('.resizers .resizer.left');
        const resizersRight = document.querySelector('.resizers .resizer.right');
        const treeDivs = document.querySelectorAll('.tree-div');
        const leftSideDivWidth = document.querySelector('#left-side-div').clientWidth;
        const rightSideDivWidth = document.querySelector('#right-side-div').clientWidth;
        const vTreeLefts = document.querySelectorAll('#left-side-div' + ' .v-tree');
        const vTreeRights = document.querySelectorAll('#right-side-div' + ' .v-tree');
        const contents = document.querySelector('#contents');
        // 高さ設定。画面ボトムのリサイズ-------------------------------------------------------
        for (const i in treeDivs) {
          if (treeDivs[i].style) treeDivs[i].style.height = (bodyHeight - footerHeight - 120) + 'px';
        }
        resizersLeft.style.height = (bodyHeight - footerHeight - headerHeight) + 'px';
        resizersRight.style.height = (bodyHeight - footerHeight - headerHeight) + 'px';
        contents.style.height = (bodyHeight - footerHeight - headerHeight) + 'px';
        document.querySelector('#footer-inner-left').style.height = (footerHeight - 40) + 'px';
        document.querySelector('#footer-inner-right').style.height = (footerHeight - 40) + 'px';
        // 幅設定。左右サイドのリサイズ---------------------------------------------------------
        vTreeLefts[0].style.width = (leftSideDivWidth - 30) + 'px';
        vTreeRights[0].style.width = (rightSideDivWidth - 30) + 'px';
        contents.style.left = leftSideDivWidth + 'px';
        if (this.rightSideDivShow) {
          contents.style.width = (bodyWidth - leftSideDivWidth - rightSideDivWidth) + 'px';
        } else {
          contents.style.width = (bodyWidth - leftSideDivWidth) + 'px';
        }
        // グラフの幅、高さ設定-----------------------------------------------------------------
        const statType = this.$store.state.base.statType;
        if (statType === 'time') {
          document.querySelector('#left-time').style.width = (bodyWidth - leftSideDivWidth - 20) + 'px';
          document.querySelector('#left-time').style.height = (bodyHeight - footerHeight - 120) + 'px';
        }
        if (statType === 'timePref') {
          document.querySelector('#left-timePref').style.width = (bodyWidth - leftSideDivWidth - 20) + 'px';
          document.querySelector('#left-timePref').style.height = (bodyHeight - footerHeight - 120) + 'px';
        }
        if (statType === 'timeCity') {
          document.querySelector('#left-timeCity').style.width = (bodyWidth - leftSideDivWidth - 20) + 'px';
          document.querySelector('#left-timeCity').style.height = (bodyHeight - footerHeight - 120) + 'px';
        }
        if (statType === 'scatterPref') {
          document.querySelector('#left-scatterPref').style.width = (bodyWidth - leftSideDivWidth - rightSideDivWidth - 20) + 'px';
          document.querySelector('#left-scatterPref').style.height = (bodyHeight - footerHeight - 200) + 'px';
        }
        if (statType === 'scatter') {
          document.querySelector('#left-scatter').style.width = (bodyWidth - leftSideDivWidth - rightSideDivWidth - 20) + 'px';
          document.querySelector('#left-scatter').style.height = (bodyHeight - footerHeight - 200) + 'px';
        }
      })
    }
  }
}
