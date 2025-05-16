package demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@Bean
	public CommandLineRunner commandLineRunner(studentRepo repo) {
		return args -> {
			Student student = new Student(2, "Aniket", "Choukale", "tejas@gmail.com");
			repo.save(student);

			Student found = repo.findById(student.getId()).orElse(null);
			System.out.println("Found student: " + found);
		};
	}
}
