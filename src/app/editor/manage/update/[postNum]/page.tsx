type Props = {
  params: { postNum: string };
};

function UpdatePost({ params }: Props) {
  return <div>{params.postNum}</div>;
}

export default UpdatePost;
