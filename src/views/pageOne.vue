<template>
  <body>
  <MenuBar></MenuBar>
    <main>
      <RowOverview></RowOverview>
      <RowDailyInbound></RowDailyInbound>
      <RowIssuesScanner></RowIssuesScanner>
      <RowKeywordCloud></RowKeywordCloud>
      <RowModelKeywordShare></RowModelKeywordShare>
      <RowInboundByRegion></RowInboundByRegion>
      <!--
      <RowHistory v-if="show_modal"></RowHistory>
       -->
    </main>
  </body>
</template>

<script>
import MenuBar from "../components/MenuBar";
import RowOverview from "../components/RowOverview";
import RowIssuesScanner from "../components/RowIssuesScanner";
import RowDailyInbound from "../components/RowdailyInbound";
import RowKeywordCloud from "../components/RowKeywordCloud";
import RowModelKeywordShare from "../components/RowModelKeywordShare"
import RowInboundByRegion from "../components/RowInboundByRegion";
// import RowHistory from "../components/RowHistory"
// import{EventBus} from "../event-bus";

export default {
    name: "pageOne",
    components:{MenuBar, RowOverview, RowIssuesScanner, RowDailyInbound, RowKeywordCloud, RowModelKeywordShare, RowInboundByRegion,  },
    data() {
      return {
      }
    },
    created(){

    }
  }
</script>

<style scoped>
  @import '../../public/css/reset.css';
  @import '../../public/css/layout.css';


</style>
