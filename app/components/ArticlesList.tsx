import { Article } from "@/app/models/article";
import { fetchFilteredArticles } from "@/app/utils/loadData"
import Card from "@/app/components/Card";
import { Suspense } from "react";
import Loading from "@/app/articles/loading";


export default async function ArticlesList({ query, currentPage }: {query: string, currentPage: number}) {
    const articles: Article[] = await fetchFilteredArticles(query, currentPage);
    return (
        <Suspense fallback={<Loading />}>
        {articles.map(article => {
            return (
                <div key={(article).id}>
                    <Card
                        id={article.id}
                        image={article.image}
                        title={article.title}
                        createDate={article.createDate}
                        description={article.description}
                        content={article.content}
                        actions={article.actions}
                        tagIDs={article.tagIDs}
                        tags={article.tags}
                    />
                </div>
            )
        })}
        </Suspense>
    )
}