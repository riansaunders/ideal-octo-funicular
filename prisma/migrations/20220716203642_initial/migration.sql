-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorAvatarURL" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Upvote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,

    CONSTRAINT "Upvote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Upvote_userId_commentId_key" ON "Upvote"("userId", "commentId");

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
