package com.PrathihasTinyUrl.UrlShortner.Services;

import com.PrathihasTinyUrl.UrlShortner.entity.userDetails;
import com.PrathihasTinyUrl.UrlShortner.userDAO.userDAOImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.ArrayList;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private userDAOImpl theUserDAOImpl;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        userDetails userFromDb = theUserDAOImpl.findUserByName(username);

        //System.out.println("user from db in mydetailsservice is: "+username);
        //System.out.println("user from db in mydetailsservice is: "+userFromDb);
        //System.out.println(userFromDb.toString());

        if (userFromDb!=null) {
            return new User(username,userFromDb.getPassword(), new ArrayList<>()); // You should encode the password using a PasswordEncoder
        } else {
            //System.out.println("user not found");
            //System.out.println("username in Myuserdetails is:"+username);
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
    }
}
