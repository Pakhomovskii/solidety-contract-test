use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    // Create a shared resource wrapped in Arc and Mutex
    let data = Arc::new(Mutex::new(0));

    let mut handles = vec![];

    // Spawn multiple threads
    for _ in 0..10 {
        let data = Arc::clone(&data); // Clone the Arc for thread safety
        let handle = thread::spawn(move || {
            let mut num = data.lock().unwrap(); // Lock the mutex
            *num += 1; // Modify the resource
        });
        handles.push(handle);
    }

    // Wait for all threads to finish
    for handle in handles {
        handle.join().unwrap();
    }

    println!("Final value: {}", *data.lock().unwrap());
}
