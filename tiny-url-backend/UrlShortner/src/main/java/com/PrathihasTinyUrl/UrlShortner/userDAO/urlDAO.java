package com.PrathihasTinyUrl.UrlShortner.userDAO;

import com.PrathihasTinyUrl.UrlShortner.entity.OnlyUrls;
import com.PrathihasTinyUrl.UrlShortner.entity.UrlDetails;

import java.util.List;

public interface urlDAO {

    void save(UrlDetails theUrlDetails);

    UrlDetails findUrlByName(String theOriginalUrl, String username);

    List<OnlyUrls> getAllUrls(String username);

    public boolean deleteUrlById(int id);

    public boolean updateUrlById(int id, String newOriginalUrl, String username);

    public boolean findShortenedUrl(String shortUrl);

    public boolean findOriginalUrl(String url, String username);

}
