package com.PrathihasTinyUrl.UrlShortner.urlController;

import com.PrathihasTinyUrl.UrlShortner.Jwt.JwtUtil;
import com.PrathihasTinyUrl.UrlShortner.entity.UrlDetails;
import com.PrathihasTinyUrl.UrlShortner.entity.userDetails;
import com.PrathihasTinyUrl.UrlShortner.userDAO.urlDAOImpl;
import com.PrathihasTinyUrl.UrlShortner.userDAO.userDAOImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.Map;

@RestController
@CrossOrigin
public class UrlController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;
    private userDAOImpl theUserDAOImpl;

    private urlDAOImpl theurlDAO;

    public UrlController(userDAOImpl theUserDAOImpl, urlDAOImpl theurlDAO)
    {
        this.theUserDAOImpl = theUserDAOImpl;
        this.theurlDAO = theurlDAO;
    }

    @GetMapping("/")
    public String sampleConnection()
    {
        System.out.println(" connection request received");
        return "Connected";
    }

    @GetMapping("/heartbeat")
    public ResponseEntity<String> check()
    {
        return ResponseEntity.ok("connected");
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginController(@RequestBody userDetails authenticationRequest) throws Exception
    {
        try {
            //System.out.println(authenticationRequest.getUsername() + " " + authenticationRequest.getPassword());
            //userDetails theInputUser = new userDetails(authenticationRequest.getUsername(), authenticationRequest.getPassword());
            // Attempt authentication with the provided username and password
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authenticationRequest.getUsername(), authenticationRequest.getPassword()));

            //System.out.println("authenticated");

            // Manually set the authentication object in the SecurityContext
            SecurityContextHolder.getContext().setAuthentication(authentication);

            //userDetails userFromDb = theUserDAOImpl.findUserByName(authenticationRequest.getUsername());

            // Load UserDetails to generate a JWT token
            final UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getUsername());
            //System.out.println("using userdetailsservice" + userDetails.toString());

            String username = userDetails.getUsername();
            final String jwtToken = jwtUtil.generateToken(username);

            //System.out.println("token is" + jwtToken);

            return ResponseEntity.ok(jwtToken);
        }
        catch (BadCredentialsException e) {
            //System.out.println("Authentication failed: Wrong password.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed: Wrong Username/Password.");
        }
        catch (AuthenticationException e) {

            // Handle other AuthenticationExceptions
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed: " + e.getMessage());
        } catch (Exception e) {
            //System.out.println("An error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An internal error occurred!");
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signupController(@RequestBody userDetails newUserDetails){
        try{
            //System.out.println(newUserDetails.toString());

            // checking if user already exists
            userDetails findUser = theUserDAOImpl.findUserByName(newUserDetails.getUsername());

            if(findUser != null){
                return ResponseEntity.status(HttpStatus.CONFLICT).body("User already exists");
            }

            theUserDAOImpl.save(newUserDetails);
            return ResponseEntity.ok("Signup Succesful");
        }
        catch(Exception e)
        {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred!");
        }
    }


    @PostMapping("/saveUrl")
    public ResponseEntity<?> saveUrl(@RequestBody UrlDetails urlDetails){
        System.out.println("in saveUrl");
        try {

            // Assuming you have the authentication context to get the username
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUsername = authentication.getName();

            //System.out.println("currentUserName is: "+currentUsername);

            userDetails user = theUserDAOImpl.findUserByName(currentUsername);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found.");
            }

            //System.out.println("urlDetails is: "+urlDetails);
            String url = urlDetails.getOriginalUrl();

            try {
                new URL(url).toURI();
            } catch (MalformedURLException | URISyntaxException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("URL is not valid");
            }

            try {
                URL theCheckurl = new URL(url);
                HttpURLConnection connection = (HttpURLConnection) theCheckurl.openConnection();

                // Optionally set a timeout
                connection.setConnectTimeout(5000); // 5 seconds
                connection.setReadTimeout(5000); // 5 seconds

                // Set request method to GET to fetch data
                connection.setRequestMethod("GET");

                // Connect to the URL
                connection.connect();

                // Get response code
                int responseCode = connection.getResponseCode();

                // Check if the response code is 2xx or 3xx
                System.out.println("responseCode is: "+responseCode);
                if(responseCode < 200 && responseCode >= 400)
                {
                    throw new Error();
                }
            } catch (Exception e) {
                // Handle exceptions
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("URL is not reachable");
            }

            if(theurlDAO.findOriginalUrl(url,currentUsername))
            {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Original URL already exists.");
            }

            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(url.getBytes(StandardCharsets.UTF_8));
            String shortUrl = Base64.getUrlEncoder().withoutPadding().encodeToString(hash).substring(0, 6);

            while(theurlDAO.findShortenedUrl(shortUrl))
            {
                digest = MessageDigest.getInstance("SHA-256");
                hash = digest.digest(shortUrl.getBytes(StandardCharsets.UTF_8));
                shortUrl = Base64.getUrlEncoder().withoutPadding().encodeToString(hash).substring(0, 6);
            }

            urlDetails.setShortenedUrl(shortUrl);
            urlDetails.setTheUserDetails(user);
            theurlDAO.save(urlDetails);
            return ResponseEntity.ok(shortUrl);
        } catch (Exception e) {
            System.out.println("error is: "+e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while saving the URL.");
        }
    }

    @PostMapping("/getMyUrls")
    public ResponseEntity<?> getUrls()
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        userDetails user = theUserDAOImpl.findUserByName(currentUsername);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found.");
        }

        return ResponseEntity.ok(theurlDAO.getAllUrls(currentUsername));
    }

    @PostMapping("/deleteUrl")
    public ResponseEntity<?> deleteUrl(@RequestBody Map<String, Integer> payload)
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        userDetails user = theUserDAOImpl.findUserByName(currentUsername);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found.");
        }

        try
        {
            int urlId = payload.get("id");
            boolean isDeleted = theurlDAO.deleteUrlById(urlId);

            if (isDeleted) {
                return ResponseEntity.ok().body("URL deleted successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("URL not found.");
            }
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occured: "+ e.getMessage());
        }
    }

    @PostMapping("/updateurl")
    public ResponseEntity<?> updateUrl(@RequestBody Map<String,String>payload)
    {
        //System.out.println("inside");

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        //System.out.println(currentUsername);
        userDetails user = theUserDAOImpl.findUserByName(currentUsername);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found.");
        }

        String url = String.valueOf(payload.get("originalUrl"));

        try {
            new URL(url).toURI();
        } catch (MalformedURLException | URISyntaxException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("URL is not valid");
        }

        try {
            URL theCheckurl = new URL(url);
            HttpURLConnection connection = (HttpURLConnection) theCheckurl.openConnection();

            // Optionally set a timeout
            connection.setConnectTimeout(5000); // 5 seconds
            connection.setReadTimeout(5000); // 5 seconds

            // Set request method to GET to fetch data
            connection.setRequestMethod("GET");

            // Connect to the URL
            connection.connect();

            // Get response code
            int responseCode = connection.getResponseCode();

            // Check if the response code is 2xx or 3xx
            System.out.println("responseCode is: "+responseCode);
            if(responseCode < 200 && responseCode >= 400)
            {
                throw new Error();
            }
        } catch (Exception e) {
            // Handle exceptions
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("URL is not reachable");
        }

        try
        {


            int id = Integer.parseInt(payload.get("id"));
            String newOriginalUrl = String.valueOf(payload.get("originalUrl"));

            boolean isUpdated = theurlDAO.updateUrlById(id, newOriginalUrl, currentUsername);

            if(isUpdated){
                return ResponseEntity.ok().body("URL updated successfully");
            }
            else
            {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Unable to update! Url already exists");
            }
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occured: "+ e.getMessage());
        }
    }
}


