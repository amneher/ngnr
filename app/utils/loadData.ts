import prisma from "./db";
import { unstable_noStore as noStore } from "next/cache";
import { Article, Tag } from "../models/article";
import { ContactItem, Resume, ResumeItem } from "../models/resume";
import { Author } from "../models/author";
import { Gallery } from "../models/gallery";
import { buildURL } from "./imgix";

export async function fetchFilteredArticles(
  query: string,
  currentPage: number
) {
  noStore();
  const perPage = 20;
  let foundArticles;
  if (query === "") {
    foundArticles = await prisma.article.findMany({
      skip: (currentPage - 1) * perPage,
      take: 20,
    });
  } else {
    foundArticles = await prisma.article.findMany({
      skip: (currentPage - 1) * perPage,
      take: 20,
      where: {
        OR: [
          {
            title: {
              contains: query,
            },
          },
          {
            description: {
              contains: query,
            },
          },
          {
            content: {
              contains: query,
            },
          },
          {
            tags: {
              some: {
                value: query,
              },
            },
          },
        ],
      },
    });
  }

  let articles = [];
  for (let index = 0; index < foundArticles.length; index++) {
    const element = await buildArticle(foundArticles[index]);
    articles.push(element);
  }
  return articles;
}

export async function fetchArticlePages(query: string) {
  noStore();
  const perPage = 20;
  let foundArticles;
  if (query === "") {
    foundArticles = await getAllArticles();
  } else {
    foundArticles = await prisma.article.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
            },
          },
          {
            description: {
              contains: query,
            },
          },
          {
            content: {
              contains: query,
            },
          },
          {
            tags: {
              some: {
                value: query,
              },
            },
          },
        ],
      },
    });
  }
  const pages = Math.ceil(foundArticles.length / perPage);
  return pages;
}

export async function fetchFilteredGalleries(
  query: string,
  currentPage: number
) {
  noStore();
  const perPage = 20;
  let foundGalleries;
  if (query === "") {
    foundGalleries = await prisma.gallery.findMany({
      skip: (currentPage - 1) * perPage,
      take: 20,
    });
  } else {
    foundGalleries = await prisma.gallery.findMany({
      skip: (currentPage - 1) * perPage,
      take: 20,
      where: {
        OR: [
          {
            id: query,
          },
          {
            title: {
              contains: query,
            },
          },
          {
            description: {
              contains: query,
            },
          },
          {
            slug: {
              contains: query,
            },
          },
          {
            s3folder: {
              contains: query,
            },
          },
          {
            items: {
              has: query,
            },
          },
        ],
      },
    });
  }
  let galleries: Gallery[] = [];
  for (let index = 0; index < foundGalleries.length; index++) {
    const element = await buildGallery(foundGalleries[index]);
    galleries.push(element)
  }
  return galleries;
}

export async function fetchGalleryPages(query: string) {
  noStore();
  const perPage = 20;
  let allGalleries;
  if (query === "") {
    allGalleries = await prisma.gallery.findMany();
  } else {
    allGalleries = await prisma.gallery.findMany({
      where: {
        OR: [
          { id: { contains: query } },
          { slug: { contains: query } },
          { title: { contains: query } },
          { createDate: query },
          { description: { contains: query } },
          { items: { has: query } },
          { authorID: { contains: query } },
        ],
      },
    });
  }
  const pages = Math.ceil(allGalleries.length / perPage);
  return pages;
}

export async function getGalleryBySlug(gallerySlug: string) {
  noStore();
  const result = await prisma.gallery.findFirstOrThrow({
    where: {
      slug: gallerySlug,
    },
  });
  const gallery =  await buildGallery(result);
  return gallery;
}

export async function getGalleriesByAuthor(authorId: string) {
  noStore();
  const items = await prisma.gallery.findMany({
    where: {
      authorID: authorId,
    },
    orderBy: {
      createDate: "desc",
    },
  });
  let galleries: Gallery[] = [];
  for (let index = 0; index < items.length; index++) {
    const element = await buildGallery(items[index]);
    galleries.push(element)
  }
  return galleries;
}

export async function getAllArticles() {
  noStore();
  // gets all the articles, with related tags.
  const articleQuery = await prisma.article.findMany();
  let articles: Article[] = [];
  for (let index = 0; index < articleQuery.length; index++) {
    const element = await buildArticle(articleQuery[index]);
    articles.push(element);
  }
  return articles;
}

export async function getHomeArticles() {
  noStore();
  // gets all the articles, with related tags.
  const articleQuery = await prisma.article.findMany({
    take: 10,
    where: {
      tags: {
        some: {
          value: "HomeContent",
        },
      },
    },
    orderBy: {
      createDate: "desc"
    }
  });
  let articles: Article[] = [];
  for (let index = 0; index < articleQuery.length; index++) {
    const element = await buildArticle(articleQuery[index]);
    articles.push(element);
  }
  return articles;
}

export async function getHomeGalleries() {
  noStore();
  const galleryQuery = await prisma.gallery.findMany({
    take: 10,
    orderBy: {
      createDate: "desc"
    }
  })
  let galleries: Gallery[] = [];
  for (let index = 0; index < galleryQuery.length; index++) {
    const element = await buildGallery(galleryQuery[index]);
    galleries.push(element);
  }
  return galleries;
}

export async function getArticle(slug: string) {
  noStore();
  // get an article by slug from the database and return it as an Article.
  const item = await prisma.article.findFirstOrThrow({
    where: {
      slug: slug,
    },
  });
  const article = await buildArticle(item);
  return article;
}

export async function getArticlesByTag(tag: string) {
  noStore();
  const items = await prisma.article.findMany({
    where: {
      tags: {
        some: {
          value: `${tag}`,
        },
      },
    },
  });
  let articles: Article[] = [];
  for (let index = 0; index < items.length; index++) {
    const element = await buildArticle(items[index]);
    articles.push(element);
  }
  return articles;
}

export async function getArticlesByTagID(tagID: string) {
  noStore();
  const items = await prisma.article.findMany({
    where: {
      tags: {
        some: {
          id: tagID,
        },
      },
    },
  });
  let articles: Article[] = [];
  for (let index = 0; index < items.length; index++) {
    const element = await buildArticle(items[index]);
    articles.push(element);
  }
  return articles;
}

export async function getArticlesByAuthor(authorID: string) {
  noStore();
  const items = await prisma.article.findMany({
    where: {
      authorID: authorID,
    },
    orderBy: {
      createDate: "desc",
    },
  });
  let articles: Article[] = [];
  for (let index = 0; index < items.length; index++) {
    const element = await buildArticle(items[index]);
    articles.push(element);
  }
  return articles;
}

export async function getAuthor(authorID: string | undefined) {
  noStore();
  const result = await prisma.author.findFirstOrThrow({
    where: {
      id: authorID,
    },
  });
  return buildAuthor(result);
}

export async function getAuthorBySlug(authorSlug: string) {
  noStore();
  const result = await prisma.author.findFirstOrThrow({
    where: {
      slug: authorSlug,
    },
  });
  return buildAuthor(result);
}

export async function getAllAuthors() {
  noStore();
  const result = await prisma.author.findMany();
  return result.map((item) => buildAuthor(item));
}

export async function getTag(id: string) {
  noStore();
  const tag = await prisma.tag.findFirstOrThrow({
    where: {
      id: `${id}`,
    },
  });
  return tag;
}

export async function getTagsByArticleID(articleID: string) {
  noStore();
  const tags = await prisma.tag.findMany({
    where: {
      articles: {
        some: {
          id: `${articleID}`,
        },
      },
    },
  });
  const tagList = tags.map((tag) => buildTag(tag));
  return tagList;
}

export async function getAllResumes() {
  noStore();
  const items = await prisma.resume.findMany({
    orderBy: {
      createDate: "desc",
    },
  });
  let resumes: Resume[] = [];
  for (let index = 0; index < items.length; index++) {
    const element = await buildResume(items[index]);
    resumes.push(element);
  }
  return resumes;
}

export async function getCurrentResume() {
  noStore();
  const currentResume = await prisma.resume.findFirstOrThrow({
    orderBy: {
      createDate: "desc",
    },
  });
  const resume = await buildResume(currentResume);
  return resume;
}

export async function getContactItems(resumeID: string) {
  noStore();
  const contactItems = await prisma.contactItem.findMany({
    where: {
      AND: [
        {
          resumeID: resumeID,
        },
        {
          include: true,
        },
      ],
    },
  });
  return contactItems.map((item) => buildContactItem(item));
}

export async function getResumeItems(resumeID: string) {
  noStore();

  const resumeItems = await prisma.resumeItem.findMany({
    where: {
      AND: [
        {
          include: true,
        },
        {
          resumeID: resumeID,
        },
      ],
    },
    orderBy: {
      startDate: "desc",
    },
  });
  return resumeItems.map((item) => buildResumeItem(item));
}

const buildArticle = async (item: {
  id: string;
  heroImage: string;
  title: string;
  slug: string;
  createDate: Date;
  description: string | null;
  teaser: string;
  content: string;
  actions: string[] | null;
  tagIDs: string[] | null;
  authorID: string;
}) => {
  const tags = await getTagsByArticleID(item.id);
  const author = await getAuthor(item.authorID);

  const article: Article = {
    id: item.id,
    heroImage: item.heroImage,
    title: item.title,
    slug: item.slug,
    createDate: item.createDate,
    typeFolder: "articles",
    description: item.description ? item.description : null,
    altText: item.teaser,
    content: item.content,
    actions: item.actions ? item.actions : null,
    tagIDs: item.tagIDs ? item.tagIDs : [],
    tags: tags,
    author: author,
    authorID: item.authorID,
  };
  return article;
};

const buildTag = (item: {
  id: string;
  slug: string;
  value: string;
  articleIDs?: string[];
}) => {
  const tag: Tag = {
    id: item.id,
    slug: item.slug,
    value: item.value,
    articleIDs: item.articleIDs ? item.articleIDs : [],
  };
  return tag;
};

const buildResume = async (item: {
  id: string;
  name: string;
  createDate: Date;
  photoURL: string | null;
  intro: string | null;
}) => {
  const contactItems = await getContactItems(item.id);
  const resumeItems = await getResumeItems(item.id);
  const resume: Resume = {
    id: item.id,
    name: item.name,
    createDate: item.createDate,
    photoURL: item.photoURL,
    contact: contactItems,
    intro: item.intro,
    experience: resumeItems,
  };
  return resume;
};

const buildContactItem = (item: {
  id: string;
  name: string;
  value: string;
  include: boolean;
}) => {
  const contactItem: ContactItem = {
    id: item.id,
    name: item.name,
    value: item.value,
    include: item.include,
  };
  return contactItem;
};

const buildResumeItem = (item: {
  id: string;
  include: boolean;
  title: string;
  company: string;
  startDate: Date;
  endDate: Date | null;
  description: string | null;
  items: string[];
}) => {
  const resumeItem: ResumeItem = {
    id: item.id,
    include: item.include,
    title: item.title,
    company: item.company,
    startDate: item.startDate,
    endDate: item.endDate,
    description: item.description,
    items: item.items,
  };
  return resumeItem;
};

export const buildAuthor = (item: {
  id: string;
  slug: string;
  title: string;
  photoUrl: string | undefined;
}) => {
  const author: Author = {
    id: item.id,
    slug: item.slug,
    title: item.title,
    photoUrl: item.photoUrl,
  };
  return author;
};

const buildGallery = async (item: {
  id: string;
  slug: string;
  title: string;
  createDate: Date;
  description: string | null;
  s3folder: string;
  items: string[];
  authorID: string;
}) => {
  const author = await getAuthor(item.authorID);

  const gallery: Gallery = {
    id: item.id,
    slug: item.slug,
    title: item.title,
    heroImage: buildURL(`${item.s3folder}/${item.items[0]}`),
    typeFolder: "galleries",
    author: author,
    createDate: item.createDate,
    description: item.description ? item.description : "",
    authorID: item.authorID,
    s3folder: item.s3folder,
    items: item.items,
    altText: item.description ? item.description : "",
    content: item.description ? item.description : "",
    tags: []
  };
  return gallery;
};
