package demo;


import org.springframework.data.jpa.repository.JpaRepository;

public interface studentRepo extends JpaRepository<Student, Integer> {
}
