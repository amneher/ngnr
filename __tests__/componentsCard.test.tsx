import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Card from "@/app/components/Card";
import ObjectID from "bson-objectid";
import { Tag } from "@/app/models/article";

const mockArticleBuilder = () => {
  let mockTags: Tag[] = [];
  let mockArticle;
  const mockTagIDs = [
    new ObjectID().toHexString(),
    new ObjectID().toHexString(),
    new ObjectID().toHexString(),
  ];
  const mockAuthor = {
    id: new ObjectID().toHexString(),
    slug: "test-author-1",
    title: "Test Author 1",
    photoUrl: "some url",
  };
  mockArticle = {
    id: new ObjectID().toHexString(),
    image:
      "https://drscdn.500px.org/photo/1083418373/q%3D80_m%3D600/v2?sig=df14fb3586104bb9f7de82ab02923a8532ed20bbd1630400a8d3bc0e8ab4de63",
    title: "Test Article",
    description: "A test article is a testicle?",
    teaser: "If a test article is a testicle, I'm just writing balls.",
    slug: "test-article",
    createDate: new Date(),
    content: "Content test. Contest. Testing . . . Content Blah Blah Blah",
    actions: ["homeLimit"],
    tagIDs: [mockTagIDs[0], mockTagIDs[1], mockTagIDs[2]],
    tags: mockTags,
    authorID: mockAuthor.id,
    author: mockAuthor,
  };
  mockTags = [
    {
      id: mockTagIDs[0],
      slug: "test-tag1",
      value: "TestTag1",
      articleIDs: [mockArticle.id],
    },
    {
      id: mockTagIDs[1],
      slug: "test-tag2",
      value: "TestTag2",
      articleIDs: [mockArticle.id],
    },
    {
      id: mockTagIDs[2],
      slug: "test-tag3",
      value: "TestTag3",
      articleIDs: [mockArticle.id],
    },
  ];
  mockArticle.tags = mockTags;
  return mockArticle;
};

describe("Card", () => {
  it("should render a Card", () => {
    const mockArticle = mockArticleBuilder();
    render(
      <Card
        id={mockArticle.id}
        image={mockArticle.image}
        title={mockArticle.title}
        description={mockArticle.description}
        slug={mockArticle.slug}
        teaser={mockArticle.teaser}
        createDate={mockArticle.createDate}
        content={mockArticle.content}
        actions={mockArticle.actions}
        tagIDs={mockArticle.tagIDs}
        tags={mockArticle.tags}
        authorID={mockArticle.authorID}
        author={mockArticle.author}
      />
    );
    const card = screen.getByLabelText(`card-${mockArticle.id}`);
    expect(card).toBeInTheDocument();
  }),
    it("should render the main link container and link to article page", () => {
      const mockArticle = mockArticleBuilder();
      render(
        <Card
          id={mockArticle.id}
          image={mockArticle.image}
          title={mockArticle.title}
          description={mockArticle.description}
          slug={mockArticle.slug}
          teaser={mockArticle.teaser}
          createDate={mockArticle.createDate}
          content={mockArticle.content}
          actions={mockArticle.actions}
          tagIDs={mockArticle.tagIDs}
          tags={mockArticle.tags}
          authorID={mockArticle.authorID}
          author={mockArticle.author}
        />
      );
      const card = screen.getByLabelText(`main-${mockArticle.id}-link`);
      expect(card).toBeInTheDocument();
    }),
    it("should render the article image if present", () => {
      const mockArticle = mockArticleBuilder();
      render(
        <Card
          id={mockArticle.id}
          image={mockArticle.image}
          title={mockArticle.title}
          description={mockArticle.description}
          slug={mockArticle.slug}
          teaser={mockArticle.teaser}
          createDate={mockArticle.createDate}
          content={mockArticle.content}
          actions={mockArticle.actions}
          tagIDs={mockArticle.tagIDs}
          tags={mockArticle.tags}
          authorID={mockArticle.authorID}
          author={mockArticle.author}
        />
      );
      const image = screen.getByLabelText(`image-${mockArticle.id}`);
      expect(image).toBeInTheDocument();
    }),
    it("should render nothing if the article image is not present", () => {
      const mockArticle = mockArticleBuilder();
      render(
        <Card
          id={mockArticle.id}
          image={""}
          title={mockArticle.title}
          description={mockArticle.description}
          slug={mockArticle.slug}
          teaser={mockArticle.teaser}
          createDate={mockArticle.createDate}
          content={mockArticle.content}
          actions={mockArticle.actions}
          tagIDs={mockArticle.tagIDs}
          tags={mockArticle.tags}
          authorID={mockArticle.authorID}
          author={mockArticle.author}
        />
      );
      const noImage = screen.getByLabelText(`noImage-${mockArticle.id}`);
      expect(noImage).toBeInTheDocument();
    }),
    it("should render the article body", () => {
      const mockArticle = mockArticleBuilder();
      render(
        <Card
          id={mockArticle.id}
          image={mockArticle.image}
          title={mockArticle.title}
          description={mockArticle.description}
          slug={mockArticle.slug}
          teaser={mockArticle.teaser}
          createDate={mockArticle.createDate}
          content={mockArticle.content}
          actions={mockArticle.actions}
          tagIDs={mockArticle.tagIDs}
          tags={mockArticle.tags}
          authorID={mockArticle.authorID}
          author={mockArticle.author}
        />
      );
      const body = screen.getByLabelText(`body-${mockArticle.id}`);
      expect(body).toBeInTheDocument();
    }),
    it("should render the article title", () => {
      const mockArticle = mockArticleBuilder();
      render(
        <Card
          id={mockArticle.id}
          image={mockArticle.image}
          title={mockArticle.title}
          description={mockArticle.description}
          slug={mockArticle.slug}
          teaser={mockArticle.teaser}
          createDate={mockArticle.createDate}
          content={mockArticle.content}
          actions={mockArticle.actions}
          tagIDs={mockArticle.tagIDs}
          tags={mockArticle.tags}
          authorID={mockArticle.authorID}
          author={mockArticle.author}
        />
      );
      const title = screen.getByLabelText(`title-${mockArticle.id}`);
      expect(title).toBeInTheDocument();
    }),
    it("should render the article description", () => {
      const mockArticle = mockArticleBuilder();
      render(
        <Card
          id={mockArticle.id}
          image={mockArticle.image}
          title={mockArticle.title}
          description={mockArticle.description}
          slug={mockArticle.slug}
          teaser={mockArticle.teaser}
          createDate={mockArticle.createDate}
          content={mockArticle.content}
          actions={mockArticle.actions}
          tagIDs={mockArticle.tagIDs}
          tags={mockArticle.tags}
          authorID={mockArticle.authorID}
          author={mockArticle.author}
        />
      );
      const description = screen.getByLabelText(
        `description-${mockArticle.id}`
      );
      expect(description).toBeInTheDocument();
    }),
    it("should render nothing if the article description is not present", () => {
      const mockArticle = mockArticleBuilder();
      render(
        <Card
          id={mockArticle.id}
          image={mockArticle.image}
          title={mockArticle.title}
          description={""}
          createDate={mockArticle.createDate}
          slug={mockArticle.slug}
          teaser={mockArticle.teaser}
          content={mockArticle.content}
          actions={mockArticle.actions}
          tagIDs={mockArticle.tagIDs}
          tags={mockArticle.tags}
          authorID={mockArticle.authorID}
          author={mockArticle.author}
        />
      );
      const noDescription = screen.getByLabelText(
        `noDescription-${mockArticle.id}`
      );
      expect(noDescription).toBeInTheDocument();
    }),
    it("should render the article createDate", () => {
      const mockArticle = mockArticleBuilder();
      render(
        <Card
          id={mockArticle.id}
          image={mockArticle.image}
          title={mockArticle.title}
          description={mockArticle.description}
          slug={mockArticle.slug}
          teaser={mockArticle.teaser}
          createDate={mockArticle.createDate}
          content={mockArticle.content}
          actions={mockArticle.actions}
          tagIDs={mockArticle.tagIDs}
          tags={mockArticle.tags}
          authorID={mockArticle.authorID}
          author={mockArticle.author}
        />
      );
      const createDate = screen.getByLabelText(`createDate-${mockArticle.id}`);
      expect(createDate).toBeInTheDocument();
    }),
    it('should render the article contentTrunc if "homeLimit" in actions', () => {
      const mockArticle = mockArticleBuilder();
      render(
        <Card
          id={mockArticle.id}
          image={mockArticle.image}
          title={mockArticle.title}
          description={mockArticle.description}
          createDate={mockArticle.createDate}
          slug={mockArticle.slug}
          teaser={mockArticle.teaser}
          content={mockArticle.content}
          actions={mockArticle.actions}
          tagIDs={mockArticle.tagIDs}
          tags={mockArticle.tags}
          authorID={mockArticle.authorID}
          author={mockArticle.author}
        />
      );
      const contentTrunc = screen.getByLabelText(`teaser-${mockArticle.id}`);
      expect(contentTrunc).toBeInTheDocument();
    }),
    it('should render the article contentFull if "homeLimit" not in actions', () => {
      const mockArticle = mockArticleBuilder();
      render(
        <Card
          id={mockArticle.id}
          image={mockArticle.image}
          title={mockArticle.title}
          description={mockArticle.description}
          slug={mockArticle.slug}
          teaser={mockArticle.teaser}
          createDate={mockArticle.createDate}
          content={mockArticle.content}
          actions={[]}
          tagIDs={mockArticle.tagIDs}
          tags={mockArticle.tags}
          authorID={mockArticle.authorID}
          author={mockArticle.author}
        />
      );
      const contentFull = screen.getByLabelText(`content-${mockArticle.id}`);
      expect(contentFull).toBeInTheDocument();
    }),
    it("should render the article tags if present", () => {
      const mockArticle = mockArticleBuilder();
      render(
        <Card
          id={mockArticle.id}
          image={mockArticle.image}
          title={mockArticle.title}
          description={mockArticle.description}
          slug={mockArticle.slug}
          teaser={mockArticle.teaser}
          createDate={mockArticle.createDate}
          content={mockArticle.content}
          actions={mockArticle.actions}
          tagIDs={mockArticle.tagIDs}
          tags={mockArticle.tags}
          authorID={mockArticle.authorID}
          author={mockArticle.author}
        />
      );
      const withTags = screen.getByLabelText(`withTags-${mockArticle.id}`);
      expect(withTags).toBeInTheDocument();
    }),
    it("should render N/A if tags not present", () => {
      const mockArticle = mockArticleBuilder();
      render(
        <Card
          id={mockArticle.id}
          image={mockArticle.image}
          title={mockArticle.title}
          description={mockArticle.description}
          slug={mockArticle.slug}
          teaser={mockArticle.teaser}
          createDate={mockArticle.createDate}
          content={mockArticle.content}
          actions={mockArticle.actions}
          tagIDs={mockArticle.tagIDs}
          tags={[]}
          authorID={mockArticle.authorID}
          author={mockArticle.author}
        />
      );
      const withoutTags = screen.getByLabelText(
        `withoutTags-${mockArticle.id}`
      );
      expect(withoutTags).toBeInTheDocument();
    });
});
