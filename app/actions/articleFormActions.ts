"use server";

import ObjectID from "bson-objectid";
import prisma from "@/app/utils/db";
import { z } from "zod";
import { redirect } from "next/navigation";
import { getArticle, getAuthorBySlug } from "@/app/utils/loadData";
import { buildURL } from "@/app/utils/imgix";
import { Article, Tag } from "@/app/models/article";
import { Author } from "@/app/models/author";

export async function CreateArticle(formData: FormData) {
  const schema = z.object({
    image: z.string(),
    title: z.string().min(1),
    slug: z.string().optional(),
    author: z.string(),
    createDate: z.string().min(1),
    description: z.string(),
    teaser: z.string().min(50),
    content: z.string().min(100),
    tags: z.string(),
  });
  const parse = schema.safeParse({
    image: formData.get("image"),
    title: formData.get("title"),
    slug: formData.get("slug"),
    authorSlug: formData.get("author"),
    createDate: new Date().toISOString(),
    description: formData.get("description"),
    teaser: formData.get("teaser"),
    content: formData.get("content"),
    tags: formData.get("tags"),
  });

  if (!parse.success) {
    return { message: "Failed to create article." };
  }

  const data = parse.data;

  console.log(data)

  const articleID = new ObjectID().toHexString();
  const author: Author = await getAuthorBySlug(data.author) 
  await prisma.article.create({
    data: {
      id: articleID,
      heroImage: data.image,
      title: data.title,
      slug: data.slug || data.title.toLowerCase().split(" ").join("-"),
      createDate: data.createDate,
      description: data.description,
      teaser: data.teaser,
      content: data.content,
      authorID: author.id
    },
  });

  const { tagsToCreate, existingTags } = await sortTags(data.tags)

  for (let index = 0; index < existingTags.length; index++) {
    const element = existingTags[index];
    await updateTagArticleIDs(element, [articleID])
  }

  const tagList = await newTags(tagsToCreate, articleID)

  const article = await getArticle(articleID);

  const result = await updateArticleTagIDs(tagList, existingTags, article)

  console.log(result);

  if (result.id) {
    return redirect("/");
  } else {
    return redirect("#")
  }
}

const sortTags = async (tags: string) => {
  const tagList = tags.split("; ")
  let tagsToCreate: string[] = [];
  let existingTags: Tag[] = [];
  for (let index = 0; index < tagList.length; index++) {
    const element = tagList[index];
    const tag = await prisma.tag.findFirst({
      where: {
        value: element,
      },
    });
    if (tag) {
      existingTags.push(tag);
    } else {
      tagsToCreate.push(element);
    }
  }
  return { "tagsToCreate": tagsToCreate, "existingTags": existingTags }
}

const newTags = async (tagsToCreate: string[], articleID: string) => {
  const tagList = tagsToCreate.map(tag => {
    return {
      id: new ObjectID().toHexString(),
      slug: tag.toLowerCase().split(" ").join("-"),
      value: tag,
      articleIDs: [articleID],
    };
  });

  if (tagList.length > 0) {
    await prisma.tag.createMany({
      data: tagList,
    });
  }
  return tagList;
}

const updateArticleTagIDs = async (tagList: Tag[], existingTags: Tag[], article: Article) => {
  let tagIDs = [];

  for (let index = 0; index < tagList.length; index++) {
    const element = tagList[index];
    tagIDs.push(element.id)    
  }

  for (let index = 0; index < existingTags.length; index++) {
    const element = existingTags[index];
    tagIDs.push(element.id);
  }

  for (let index = 0; index < article.tagIDs.length; index++) {
    const tagID = article.tagIDs[index];
    tagIDs.push(tagID);
  }

  const result = await prisma.article.update({
    where: {
      id: article.id,
    },
    data: {
      tagIDs: tagIDs,
    },
  });
  return result
}

const updateTagArticleIDs = async (tag: Tag, articleIDs: string[]) => {
  let allIDs = tag.articleIDs;
  for (let index = 0; index < articleIDs.length; index++) {
    const element = articleIDs[index];
    allIDs.push(element)    
  }
  const result = await prisma.tag.update({
    where: {
      id: tag.id
    },
    data: {
      articleIDs: allIDs
    }
  })
  return result;
}