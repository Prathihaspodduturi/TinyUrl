package com.PrathihasTinyUrl.UrlShortner.entity;

import org.springframework.security.core.parameters.P;

public class OnlyUrls {

    public int id;
    public String originalUrl;
    public String shortenedUrl;

    public OnlyUrls(){};

    public OnlyUrls(int id,String originalUrl, String shortenedUrl)
    {
        this.id = id;
        this.originalUrl = originalUrl;
        this.shortenedUrl = shortenedUrl;
    }
    public String getOriginalUrl() {
        return originalUrl;
    }

    public void setOriginalUrl(String originalUrl) {
        this.originalUrl = originalUrl;
    }

    public String getShortenedUrl() {
        return shortenedUrl;
    }

    public void setShortenedUrl(String shortenedUrl) {
        this.shortenedUrl = shortenedUrl;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "OnlyUrls{" +
                "id=" + id +
                ", originalUrl='" + originalUrl + '\'' +
                ", shortenedUrl='" + shortenedUrl + '\'' +
                '}';
    }
}
