import java.util.Arrays;
import java.util.Random;
import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.CyclicBarrier;

public class CyclicBarrierTest {
    private static final int N_THREAD = 5;
    private static final int EPOCH = 4;

    int[] results = new int[N_THREAD];
    Runnable[] tasks = new Runnable[N_THREAD];
    Random random = new Random();
    CyclicBarrier barrier = new CyclicBarrier(N_THREAD, ()-> {
        System.out.print("This epoch: result= [");
        Arrays.stream(results).forEach(i -> System.out.print(i + ", "));
        System.out.println("]");
    });

    class TaskRunner implements Runnable {
        int epoch = 0;
        int index;
        public TaskRunner(int index) {
            this.index = index;
        }

        @Override
        public void run() {
            for (epoch=0; epoch < EPOCH; epoch++) {
                try {
                    int result = random.nextInt(N_THREAD);
                    Thread.sleep(result * 1000);
                    results[index] = result;
                    System.out.println(String.format("Task-%d: %d", index, result));
                    barrier.await();
                } catch (InterruptedException | BrokenBarrierException e) {
                    throw new RuntimeException(e);
                }
            }
        }
    }

    public static void main(String[] args) throws InterruptedException {

        CyclicBarrierTest test = new CyclicBarrierTest();

        for (int i = 0; i < N_THREAD; i++) {
            new Thread(test.new TaskRunner(i)).start();
        }
    }
}
