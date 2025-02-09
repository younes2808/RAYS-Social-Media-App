# Use official .NET runtime as a base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 10000

# Use .NET SDK for building the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["ServerAPI.csproj", "./"]
RUN dotnet restore "./ServerAPI.csproj"

# Copy everything and publish
COPY . .
RUN dotnet publish "./ServerAPI.csproj" -c Release -o /app/publish

# Apply migrations during the build
FROM build AS migrations
WORKDIR /src
RUN dotnet ef database update --project ./ServerAPI/ServerAPI.csproj

# Build runtime image
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "ServerAPI.dll"]
