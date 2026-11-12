package com.example.sms.service;

import com.example.sms.model.Student;
import com.example.sms.repository.StudentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
public class StudentService {

    private final StudentRepository repository;

    public StudentService(StudentRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Student> findAll() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Student findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found: " + id));
    }

    public Student create(Student student) {
        ensureEmailAvailable(student.getEmail(), null);
        return repository.save(student);
    }

    public Student update(Long id, Student data) {
        Student existing = findById(id);
        ensureEmailAvailable(data.getEmail(), id);
        existing.setName(data.getName());
        existing.setEmail(data.getEmail());
        existing.setCourse(data.getCourse());
        existing.setPhone(data.getPhone());
        // Hibernate notices the changes and saves them when the transaction commits
        return existing;
    }

    public void delete(Long id) {
        repository.delete(findById(id));
    }

    private void ensureEmailAvailable(String email, Long currentId) {
        repository.findByEmailIgnoreCase(email).ifPresent(other -> {
            if (!other.getId().equals(currentId)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
            }
        });
    }
}
