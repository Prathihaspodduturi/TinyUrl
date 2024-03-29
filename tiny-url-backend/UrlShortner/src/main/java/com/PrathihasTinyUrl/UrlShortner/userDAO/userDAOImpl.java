package com.PrathihasTinyUrl.UrlShortner.userDAO;

import com.PrathihasTinyUrl.UrlShortner.entity.userDetails;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class userDAOImpl implements userDAO{

    // define field for entity manager

    private EntityManager entityManager;

    // inject entity manager using contructor injection

    @Autowired
    public userDAOImpl(EntityManager entityManager)
    {
        this.entityManager = entityManager;
    }

    @Override
    @Transactional
    public void save(userDetails theuser) {
        entityManager.persist(theuser);
    }

    @Override
    public userDetails findUserByName(String userName) {
        return entityManager.find(userDetails.class, userName);
    }
}
