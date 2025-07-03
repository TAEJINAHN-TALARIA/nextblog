import type { Metadata } from "next";
import "@fontsource/roboto";
export const metadata: Metadata = {
  title: "Talaria",
  description:
    "프론트엔드 개발과 데이터 분석을 공부하며 배운 내용을 정리해 나가는 쓰는 기술 블로그입니다. JavaScript, React, CSS, Python, PyTorch 같은 기술들을 차근차근 정리하고 공유해요.",
  verification: {
    google: "E0JzjJd0hlEJvaLl8P82Z4v2IIkwTPPG9u1h73S4xpg",
  },
  category: "Technology",
};

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

export default RootLayout;
