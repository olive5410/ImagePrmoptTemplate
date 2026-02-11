import GoogleAnalytics from "./google-analytics";
import OpenPanelAnalytics from "./open-panel";
import Plausible from "./plausible";

export default function Analytics() {
  // 在开发环境也加载 Google Analytics，方便测试事件追踪
  // OpenPanel 和 Plausible 仍然只在生产环境加载
  const isProduction = process.env.NODE_ENV === "production";
  const gaEnabled =
    process.env.NEXT_PUBLIC_GA_ENABLED !== "false" &&
    !!process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

  return (
    <>
      {isProduction && <OpenPanelAnalytics />}
      {gaEnabled && <GoogleAnalytics />}
      {isProduction && <Plausible />}
    </>
  );
}
