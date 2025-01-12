FROM node:22-bullseye-slim

WORKDIR /app

# 必要なパッケージをインストール（必要に応じて調整可能）
RUN apt-get update && apt-get install -y curl

# corepack を有効化
RUN corepack enable

# package.json と pnpm-lock.yaml だけを最初にコピー（キャッシュを活用）
COPY package.json pnpm-lock.yaml ./

# 依存関係をインストール（Linux 用の正しいバイナリを取得）
RUN pnpm install --frozen-lockfile

# 残りのアプリケーションコードをコピー
COPY . .

# アプリケーションを実行
CMD ["sh", "-c", "pnpm run dev"]
