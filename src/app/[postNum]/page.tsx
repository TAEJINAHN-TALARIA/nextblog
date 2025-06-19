type Props = {
  params: { postNum: string };
};

function PostView({ params }: Props) {
  return <div>{params.postNum} 페이지입니다.</div>;
}

export default PostView;
