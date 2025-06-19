type Props = {
  params: Promise<{ postId: string }>;
};

async function PostView({ params }: Props) {
  const postId = (await params).postId;
  return <div>{postId} 페이지입니다.</div>;
}

export default PostView;
