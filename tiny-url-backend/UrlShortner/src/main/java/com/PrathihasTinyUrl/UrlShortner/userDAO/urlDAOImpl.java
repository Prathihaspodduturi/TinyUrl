package com.PrathihasTinyUrl.UrlShortner.userDAO;

import com.PrathihasTinyUrl.UrlShortner.entity.OnlyUrls;
import com.PrathihasTinyUrl.UrlShortner.entity.UrlDetails;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.NonUniqueResultException;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;


@Repository
public class urlDAOImpl implements urlDAO{

    private EntityManager entityManager;

    public urlDAOImpl(EntityManager entityManager)
    {
        this.entityManager = entityManager;
    }
    @Override
    @Transactional
    public void save(UrlDetails theUrlDetais) {
        entityManager.persist(theUrlDetais);
    }

    @Override
    public UrlDetails findUrlByName(String theOriginalUrl, String username) {
        return null;
    }

    @Override
    public List<OnlyUrls> getAllUrls(String theUsername) {

        System.out.println("urls username is: "+theUsername);

        String findUrlsByName = "Select u from UrlDetails u where u.theUserDetails.username=:theUsername";

        TypedQuery<UrlDetails> query = entityManager.createQuery(findUrlsByName, UrlDetails.class);
        query.setParameter("theUsername", theUsername);

        List<UrlDetails> result = query.getResultList();

        List<OnlyUrls> ans = new ArrayList<>();

        for(UrlDetails tempUrlDetails : result)
        {
            OnlyUrls theOnlyUrl = new OnlyUrls(tempUrlDetails.getId(),tempUrlDetails.getOriginalUrl(), tempUrlDetails.getShortenedUrl());
            ans.add(theOnlyUrl);
        }
        return ans;
    }

    @Override
    @Transactional
    public boolean deleteUrlById(int id) {
        UrlDetails url = entityManager.find(UrlDetails.class, id);
        if(url!= null)
        {
            entityManager.remove(url);
            return true;
        }
        return false;
    }

    @Override
    @Transactional
    public boolean updateUrlById(int id, String newOriginalUrl, String username) {

        String findUrlsByName = "Select u from UrlDetails u where u.theUserDetails.username=:username and u.originalUrl=:newOriginalUrl";

        TypedQuery<UrlDetails> query = entityManager.createQuery(findUrlsByName, UrlDetails.class);
        query.setParameter("username", username);
        query.setParameter("newOriginalUrl", newOriginalUrl);

        UrlDetails theurldetails = null;
        try {
            theurldetails = query.getSingleResult();
        } catch (NoResultException e) {
            // Handle the case where no result is found
            theurldetails = null; // Or any other appropriate action
        } catch (NonUniqueResultException e) {
            // Handle the case where more than one result is found
            // This might involve throwing a custom exception or logging an error
        }

        if(theurldetails != null)
            return false;

        UrlDetails urlDetails = entityManager.find(UrlDetails.class,id);

        if(urlDetails != null){
            urlDetails.setOriginalUrl(newOriginalUrl);
            entityManager.merge(urlDetails);
            return true;
        }

        return false;
    }

    @Override
    public boolean findShortenedUrl(String shortUrl) {
        String findUrlsByName = "Select u from UrlDetails u where u.shortenedUrl=:shortUrl";

        TypedQuery<UrlDetails> query = entityManager.createQuery(findUrlsByName, UrlDetails.class);
        query.setParameter("shortUrl", shortUrl);

        UrlDetails theurldetails = null;
        try {
            theurldetails = query.getSingleResult();
        } catch (NoResultException e) {
            // Handle the case where no result is found
            theurldetails = null; // Or any other appropriate action
        } catch (NonUniqueResultException e) {
            // Handle the case where more than one result is found
            // This might involve throwing a custom exception or logging an error
        }

        return theurldetails != null;
    }

    @Override
    public boolean findOriginalUrl(String url, String username) {

        String findUrlsByName = "Select u from UrlDetails u where u.theUserDetails.username=:username and u.originalUrl=:url";

        TypedQuery<UrlDetails> query = entityManager.createQuery(findUrlsByName, UrlDetails.class);
        query.setParameter("username", username);
        query.setParameter("url", url);


        UrlDetails theurldetails = null;
        try {
            theurldetails = query.getSingleResult();
        } catch (NoResultException e) {
            // Handle the case where no result is found
            theurldetails = null; // Or any other appropriate action
        } catch (NonUniqueResultException e) {
            // Handle the case where more than one result is found
            // This might involve throwing a custom exception or logging an error
        }

        return theurldetails != null;

    }
}
