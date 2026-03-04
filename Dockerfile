# ── Build stage ───────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY TinyTutor.csproj .
RUN dotnet restore

COPY . .
RUN dotnet publish -c Release -o /app/publish --no-restore

# ── Runtime stage ─────────────────────────────────────────────
FROM docker.io/nginx:alpine
COPY --from=build /app/publish/wwwroot /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080
