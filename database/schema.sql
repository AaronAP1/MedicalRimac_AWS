-- Database schema for Peru (db_pe)
CREATE DATABASE IF NOT EXISTS db_pe;
USE db_pe;

CREATE TABLE appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  appointment_id VARCHAR(36) UNIQUE NOT NULL,
  insured_id VARCHAR(5) NOT NULL,
  schedule_id INT NOT NULL,
  center_id INT,
  specialty_id INT,
  medic_id INT,
  appointment_date DATETIME,
  country_iso VARCHAR(2) DEFAULT 'PE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_insured_id (insured_id),
  INDEX idx_appointment_id (appointment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Database schema for Chile (db_cl)
CREATE DATABASE IF NOT EXISTS db_cl;
USE db_cl;

CREATE TABLE appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  appointment_id VARCHAR(36) UNIQUE NOT NULL,
  insured_id VARCHAR(5) NOT NULL,
  schedule_id INT NOT NULL,
  center_id INT,
  specialty_id INT,
  medic_id INT,
  appointment_date DATETIME,
  country_iso VARCHAR(2) DEFAULT 'CL',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_insured_id (insured_id),
  INDEX idx_appointment_id (appointment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
