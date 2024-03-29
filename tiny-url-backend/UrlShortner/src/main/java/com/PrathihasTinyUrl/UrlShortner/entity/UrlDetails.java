package com.PrathihasTinyUrl.UrlShortner.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "url_shortener")
public class UrlDetails {

    // define the fields and map them to databse table columns

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "original_url")
    private String originalUrl;

    @Column(name = "shortened_url")
    private String shortenedUrl;

    @ManyToOne(cascade = {CascadeType.REFRESH, CascadeType.MERGE})
    @JoinColumn(name = "username", referencedColumnName = "username")
    private userDetails theUserDetails;

    public UrlDetails(){}

    public UrlDetails(String originalUrl, String shortenedUrl)
    {
        this.originalUrl = originalUrl;
        this.shortenedUrl = shortenedUrl;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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

    public userDetails getTheUserDetails() {
        return theUserDetails;
    }

    public void setTheUserDetails(userDetails theUserDetails) {
        this.theUserDetails = theUserDetails;
    }

    @Override
    public String toString() {
        return "UrlTable{" +
                "id=" + id +
                ", orginalUrl='" + originalUrl + '\'' +
                ", shortenedUrl='" + shortenedUrl + '\'' +
                ", theUserDetails=" + theUserDetails +
                '}';
    }

}
