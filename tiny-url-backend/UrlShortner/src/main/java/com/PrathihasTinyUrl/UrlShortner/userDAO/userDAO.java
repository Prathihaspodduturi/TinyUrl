package com.PrathihasTinyUrl.UrlShortner.userDAO;

import com.PrathihasTinyUrl.UrlShortner.entity.userDetails;

public interface userDAO {

    void save(userDetails theuser);

    userDetails findUserByName(String userName);

}
