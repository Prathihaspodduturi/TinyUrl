CREATE TABLE `url_shortener` (
  `id` int NOT NULL AUTO_INCREMENT,
  `original_url` varchar(500) NOT NULL,
  `shortened_url` varchar(255) NOT NULL,
  `username` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `username` (`username`),
  CONSTRAINT `url_shortener_ibfk_1` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=latin1;
