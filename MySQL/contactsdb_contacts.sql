-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: contactsdb
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacts` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `FullName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Position` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Department` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Building` varchar(50) DEFAULT NULL,
  `OfficeNumber` varchar(20) DEFAULT NULL,
  `InternalPhone` varchar(20) DEFAULT NULL,
  `CityPhone` varchar(20) DEFAULT NULL,
  `MobilePhone` varchar(20) DEFAULT NULL,
  `Email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Login` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Role` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacts`
--

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
INSERT INTO `contacts` VALUES (1,'Иванов Иван Иванович','Программист','IT','A','301','1301','+7 (495) 123-45-01','+7 915 000-00-01','ivanov.i@company.ru','ivanov','pass123',0),(2,'Петров Пётр Сергеевич','Системный администратор','IT','A','302','1302','+7 (495) 123-45-02','+7 915 000-00-02','petrov.p@company.ru','petrov','pass123',1),(3,'Сидорова Анна Викторовна','HR-менеджер','HR','B','210','1210','+7 (495) 123-45-03','+7 915 000-00-03','sidorova.a@company.ru','sidorova','pass123',0),(4,'Кузнецов Дмитрий Андреевич','Бухгалтер','Finance','B','215','1215','+7 (495) 123-45-04','+7 915 000-00-04','kuznetsov.d@company.ru','kuznetsov','pass123',0),(5,'Смирнова Елена Павловна','Главный бухгалтер','Finance','B','216','1216','+7 (495) 123-45-05','+7 915 000-00-05','smirnova.e@company.ru','smirnova','pass123',0),(6,'Васильев Алексей Николаевич','Проектный менеджер','Management','C','401','1401','+7 (495) 123-45-06','+7 915 000-00-06','vasiliev.a@company.ru','vasiliev','pass123',0),(7,'Фёдорова Мария Олеговна','UX-дизайнер','Design','A','305','1305','+7 (495) 123-45-07','+7 915 000-00-07','fedorova.m@company.ru','fedorova','pass123',0),(8,'Морозов Кирилл Ильич','Frontend-разработчик','IT','A','303','1303','+7 (495) 123-45-08','+7 915 000-00-08','morozov.k@company.ru','morozov','pass123',0),(9,'Орлова Наталья Сергеевна','Маркетолог','Marketing','C','410','1410','+7 (495) 123-45-09','+7 915 000-00-09','orlova.n@company.ru','orlova','pass123',0),(10,'Волков Сергей Михайлович','Руководитель IT-отдела','IT','A','300','1300','+7 (495) 123-45-10','+7 915 000-00-10','volkov.s@company.ru','volkov','pass123',1),(11,'Никитина Ольга Романовна','Офис-менеджер','Administration','B','101','1101','+7 (495) 123-45-11','+7 915 000-00-11','nikitina.o@company.ru','nikitina','pass123',0),(12,'Зайцев Артём Денисович','Backend-разработчик','IT','A','304','1304','+7 (495) 123-45-12','+7 915 000-00-12','zaitsev.a@company.ru','zaitsev','pass123',0),(13,'Крылова Татьяна Игоревна','Юрист','Legal','C','420','1420','+7 (495) 123-45-13','+7 915 000-00-13','krylova.t@company.ru','krylova','pass123',0),(14,'Беляев Роман Евгеньевич','Специалист по закупкам','Procurement','C','415','1415','+7 (495) 123-45-14','+7 915 000-00-14','belyaev.r@company.ru','belyaev','pass123',0),(15,'Громова Ирина Алексеевна','Аналитик','Analytics','B','220','1220','+7 (495) 123-45-15','+7 915 000-00-15','gromova.i@company.ru','gromova','pass123',0);
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-23 14:29:35
