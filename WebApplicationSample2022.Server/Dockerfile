#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["WebApplicationSample2022.Server/WebApplicationSample2022.Server.csproj", "WebApplicationSample2022.Server/"]
RUN dotnet restore "WebApplicationSample2022.Server/WebApplicationSample2022.Server.csproj"
COPY . .
WORKDIR "/src/WebApplicationSample2022.Server"
RUN dotnet build "WebApplicationSample2022.Server.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "WebApplicationSample2022.Server.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WebApplicationSample2022.Server.dll"]